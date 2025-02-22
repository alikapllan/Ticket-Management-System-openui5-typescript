import { Request, Response } from "express";
import pool from "../config/db";

// GET all ticket types from db
export const getAllTicketTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Ticket Type: Request GET");
  try {
    const result = await pool.query(
      `
      SELECT 
        "ticketTypeId",
        TRIM("name") AS "name"
      FROM 
        "TicketType" 
      ORDER BY 
        "ticketTypeId" ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
