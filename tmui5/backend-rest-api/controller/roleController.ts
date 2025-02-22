import { Request, Response } from "express";
import pool from "../config/db";

// GET all roles from db
export const getAllRoles = async (
  _req: Request,
  res: Response
): Promise<void> => {
  console.log("Role: Request GET");

  try {
    const result = await pool.query(
      `
      SELECT 
        "roleId", 
        "name"
      FROM "Role" 
      ORDER BY 
        "roleId" ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
