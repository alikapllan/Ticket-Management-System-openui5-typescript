import pkg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Extract Pool from the pg package
const { Pool } = pkg;

// Create a new Pool instance
const pool: any = new Pool({
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_DATABASE as string,
  password: process.env.DB_PASSWORD as string,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

// Export the pool instance for database access
export default pool;
