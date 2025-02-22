import { Request, Response } from "express";
import pool from "../config/db";

// GET all ticket statuses from db
export const getAllTicketStatuses = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Ticket Status: Request GET");

  try {
    const result = await pool.query(
      `
        SELECT 
            "ticketStatusId",
            TRIM("name") AS "ticketStatusName" 
        FROM "TicketStatus" 
        ORDER BY 
            "ticketStatusId" ASC
        `
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
