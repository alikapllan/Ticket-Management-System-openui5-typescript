import { Request, Response } from "express";
import pool from "../config/db.js";

// GET all ticket comments of a ticket from db
export const getAllTicketComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  console.log("Ticket Comment: Request GET for ticketId: ", id);

  try {
    const result = await pool.query(
      `
      SELECT 
        "ticketCommentId",
        "ticketId",
        TRIM("comment") AS "comment",
        "createdAt"
      FROM 
        "TicketComment" 
      WHERE 
        "ticketId" = $1 
      ORDER BY 
        "ticketCommentId", "ticketId" ASC
      `,
      [id]
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a ticket comment
export const createTicketComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ticketId, comment } = req.body;

  console.log("Ticket Comment: Request POST for ticketId: ", ticketId);

  try {
    const result = await pool.query(
      `INSERT INTO "TicketComment" 
          ("ticketId", 
           "comment", 
           "createdAt") 
        VALUES ($1, $2, NOW()::timestamp) 
        RETURNING *`,
      [ticketId, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
