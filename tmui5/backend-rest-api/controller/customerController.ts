import { Request, Response } from "express";
import pool from "../config/db";

// GET all customers
export const getAllCustomers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  console.log("Customer: Request GET");

  try {
    const result = await pool.query(
      `
      SELECT 
        "customerId", 
        TRIM("name") AS "name",
        TRIM("email") AS "email",
        "phone"
       FROM "Customer" 
       ORDER BY "customerId" ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a customer
export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, phone } = req.body;
  console.log("Customer: Request body POST:", req.body);

  try {
    const result = await pool.query(
      `INSERT INTO "Customer" 
        ("name", "email", "phone", "createdAt") 
        VALUES ($1, $2, $3, NOW()::timestamp) 
        RETURNING *`,
      [name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a customer
export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log("Customer: Request body DELETE, customerId: ", id);

  try {
    await pool.query('DELETE FROM "Customer" WHERE "customerId" = $1', [id]);
    res.status(204).send(); // No Content
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
