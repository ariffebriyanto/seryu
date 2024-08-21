# Seryu Cargo Backend

This is the backend API for Seryu Cargo, a logistics company. The API provides functionality to manage driver salaries, shipments, and other related logistics operations.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

To run this application locally, you'll need to have Node.js and PostgreSQL installed on your machine.

### Clone the repository

```bash
git clone https://github.com/ariffebriyanto/seryu.git
cd seryu-cargo-backend


Sure! Here's a basic README.md file that you can use to guide users on how to run your Node.js application.

markdown
Salin kode
# Seryu Cargo Backend

This is the backend API for Seryu Cargo, a logistics company. The API provides functionality to manage driver salaries, shipments, and other related logistics operations.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

To run this application locally, you'll need to have Node.js and PostgreSQL installed on your machine.

### Clone the repository

```bash
git clone  https://github.com/ariffebriyanto/seryu.git
cd seryu-cargo-backend

Install dependencies
Running the Application
Development
To run the application in development mode with hot-reloading:


npm run dev
Production
To run the application in production mode:


npm run build
npm start
The server will start on http://localhost:3000 by default, but you can specify a different port in the .env file.

API Endpoints
Driver List
Endpoint: /driver/list
Method: GET
Description: Fetches the list of drivers with their salaries and other details.
Query Parameters:
month (required): The month for which the salary data is needed.
year (required): The year for which the salary data is needed.
page_size (optional): Number of results per page.
current (optional): The current page number.
driver_code (optional): Filter by driver code.
status (optional): Filter by salary status (PENDING, CONFIRMED, PAID).
name (optional): Filter by driver name.
Example request:


curl "http://localhost:3000/driver/list?month=8&year=2024&page_size=10&current=1"
Other Endpoints
Documentation for additional endpoints can be added here.

License
This project is licensed under the MIT License. See the LICENSE file for details.



### Explanation:

- **Installation**: Guides users on how to clone the repo and install necessary dependencies.
- **Configuration**: Instructs on setting up environment variables.
- **Database Setup**: Provides basic SQL commands to set up the necessary tables in the PostgreSQL database.
- **Running the Application**: Explains how to start the server in both development and production modes.
- **API Endpoints**: Details the main API endpoint for the driver list with example usage.
- **License**: Mentions the licensing of the project.

This `README.md` file should help anyone who wants to set up and run your application.









