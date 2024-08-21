import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/driver/list', async (req: Request, res: Response) => {
  try {
    const { month, year, page_size = 10, current = 1, driver_code, status, name } = req.query;

    // Base query to calculate total rows
    let countQuery = `
      SELECT COUNT(*) AS total_count
      FROM (
        SELECT d.driver_code
        FROM drivers d
        LEFT JOIN driver_attendances sa ON d.driver_code = sa.driver_code
        LEFT JOIN shipment_costs sc ON d.driver_code = sc.driver_code
        LEFT JOIN shipments s ON s.shipment_no = sc.shipment_no AND s.shipment_status != 'CANCELED'
        LEFT JOIN variable_configs vc ON vc.key = 'DRIVER_MONTHLY_ATTENDANCE_SALARY'
        WHERE EXTRACT(MONTH FROM s.shipment_date) = $1
          AND EXTRACT(YEAR FROM s.shipment_date) = $2
        GROUP BY d.driver_code
      ) AS subquery
    `;

    // Base query to fetch data with pagination
    let dataQuery = `
      WITH driver_salaries AS (
        SELECT d.driver_code, d.name,
          COALESCE(SUM(CASE WHEN sc.cost_status = 'PENDING' THEN sc.total_costs ELSE 0 END), 0) AS total_pending,
          COALESCE(SUM(CASE WHEN sc.cost_status = 'CONFIRMED' THEN sc.total_costs ELSE 0 END), 0) AS total_confirmed,
          COALESCE(SUM(CASE WHEN sc.cost_status = 'PAID' THEN sc.total_costs ELSE 0 END), 0) AS total_paid,
          COALESCE(COUNT(sa.id) * vc.value, 0) AS total_attendance_salary,
          COALESCE(SUM(CASE WHEN sc.cost_status IN ('PENDING', 'CONFIRMED', 'PAID') THEN sc.total_costs ELSE 0 END), 0) + COALESCE(COUNT(sa.id) * vc.value, 0) AS total_salary,
          COALESCE(COUNT(DISTINCT s.shipment_no), 0) AS count_shipment
        FROM drivers d
        LEFT JOIN driver_attendances sa ON d.driver_code = sa.driver_code
        LEFT JOIN shipment_costs sc ON d.driver_code = sc.driver_code
        LEFT JOIN shipments s ON s.shipment_no = sc.shipment_no AND s.shipment_status != 'CANCELED'
        LEFT JOIN variable_configs vc ON vc.key = 'DRIVER_MONTHLY_ATTENDANCE_SALARY'
        WHERE EXTRACT(MONTH FROM s.shipment_date) = $1
          AND EXTRACT(YEAR FROM s.shipment_date) = $2
        GROUP BY d.driver_code, d.name, vc.value
      )
      SELECT * FROM driver_salaries
    `;

    // Add dynamic filters to the count query
    const countParams: any[] = [month, year];
    if (driver_code || name) {
      countQuery += ` WHERE `;
    }
    if (driver_code) {
      countQuery += `subquery.driver_code = $${countParams.length + 1}`;
      countParams.push(driver_code);
    }
    if (name) {
      if (driver_code) countQuery += ` AND `;
      countQuery += `subquery.name ILIKE $${countParams.length + 1}`;
      countParams.push(`%${name}%`);
    }

    // Add dynamic filters to the data query
    const dataParams: any[] = [month, year];
    let whereClauseAdded = false;
    if (driver_code || name || status) {
      dataQuery += ` WHERE `;
    }
    if (driver_code) {
      dataQuery += `driver_salaries.driver_code = $${dataParams.length + 1}`;
      dataParams.push(driver_code);
      whereClauseAdded = true;
    }
    if (name) {
      if (whereClauseAdded) dataQuery += ` AND `;
      dataQuery += `driver_salaries.name ILIKE $${dataParams.length + 1}`;
      dataParams.push(`%${name}%`);
      whereClauseAdded = true;
    }

    // Apply the status filter after the aggregation
    if (status) {
      if (whereClauseAdded) dataQuery += ` AND `;
      if (status === 'PENDING') {
        dataQuery += `total_pending > 0`;
      } else if (status === 'CONFIRMED') {
        dataQuery += `total_confirmed > 0`;
      } else {
        dataQuery += `total_paid > 0 AND total_confirmed = 0 AND total_pending = 0`;
      }
    }

    dataQuery += ` ORDER BY driver_salaries.driver_code
      LIMIT $${dataParams.length + 1} OFFSET $${dataParams.length + 2}`;
    dataParams.push(Number(page_size), (Number(current) - 1) * Number(page_size));

    // Execute count query
    const countResult = await pool.query(countQuery, countParams);
    const totalRow = parseInt(countResult.rows[0].total_count, 10);

    // Execute data query
    const dataResult = await pool.query(dataQuery, dataParams);

    res.json({
      data: dataResult.rows,
      total_row: totalRow,
      current: Number(current),
      page_size: Number(page_size)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
