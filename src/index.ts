import express from 'express';
import salaryRouter from './routes/salary';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/v1/salary', salaryRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
