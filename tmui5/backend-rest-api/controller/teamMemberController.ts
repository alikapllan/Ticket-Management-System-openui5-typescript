import { Request, Response } from "express";
import pool from "../config/db";

// GET all team members
export const getAllTeamMembers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  console.log("Team Member: Request GET");

  try {
    const result = await pool.query(
      `
      SELECT 
        tm."teamMemberId", 
        CONCAT(TRIM(tm."name"), ' ', TRIM(tm."surname")) AS "fullName",
        TRIM(tm."email") AS "email", 
        tm."phone", 
        r."name" AS "role"
      FROM 
        "TeamMember" tm
      INNER JOIN 
        "Role" r 
      ON 
        tm."roleId" = r."roleId"
      ORDER BY 
        tm."teamMemberId" ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a team member
export const createTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, surname, roleId, email, phone } = req.body;

  console.log("Team Member: Request body POST:", req.body);

  try {
    const result = await pool.query(
      `INSERT INTO "TeamMember" 
          ("name", 
           "surname", 
           "roleId", 
           "email", 
           "phone", 
           "createdAt") 
          VALUES ($1, $2, $3, $4, $5, NOW()::timestamp) 
          RETURNING *`,
      [name, surname, roleId, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a team member
export const deleteTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  console.log("Team Member: Request body DELETE, teamMemberId: ", id);

  try {
    await pool.query('DELETE FROM "TeamMember" WHERE "teamMemberId" = $1', [
      id,
    ]);
    res.status(204).send(); // No Content
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
