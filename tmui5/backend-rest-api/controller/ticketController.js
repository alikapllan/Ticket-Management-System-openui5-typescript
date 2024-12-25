const pool = require("../config/db");

// GET all tickets
const getAllTickets = async (req, res) => {
  console.log("Ticket: Request GET");
  try {
    const result = await pool.query(
      `
      SELECT 
        t."ticketId",
        t."ticketTypeId",
        TRIM(tt."name") AS "ticketTypeName",
        t."teamMemberId",
        CONCAT(TRIM(tm."name"), ' ', TRIM(tm."surname")) AS "teamMemberFullName",
        TRIM(tm."email") AS "teamMemberEmail",
        t."customerId",
        TRIM(c."name") AS "customerName",
        t."ticketStatusId",
        TRIM(ts."name") AS "ticketStatusName",
        TRIM(t."title") AS "title",
        TRIM(t."description") AS "description",
        t."createdAt"
      FROM 
        "Ticket" t
      LEFT JOIN "TicketType" tt
        ON t."ticketTypeId" = tt."ticketTypeId"
      LEFT JOIN "Customer" c
        ON t."customerId" = c."customerId"
      LEFT JOIN "TeamMember" tm 
        ON t."teamMemberId" = tm."teamMemberId"
      LEFT JOIN "TicketStatus" ts 
        ON t."ticketStatusId" = ts."ticketStatusId"
      ORDER BY 
        t."ticketId" ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicket = async (req, res) => {
  const { id } = req.params;
  console.log(`Ticket: Request GET for ticketId: ${id}`);
  try {
    const result = await pool.query(
      `
      SELECT 
        t."ticketId",
        t."ticketTypeId",
        TRIM(tt."name") AS "ticketTypeName",
        t."teamMemberId",
        CONCAT(TRIM(tm."name"), ' ', TRIM(tm."surname")) AS "teamMemberFullName",
        TRIM(tm."email") AS "teamMemberEmail",
        t."customerId",
        TRIM(c."name") AS "customerName",
        t."ticketStatusId",
        TRIM(ts."name") AS "ticketStatusName",
        TRIM(t."title") AS "title",
        TRIM(t."description") AS "description",
        t."createdAt"
      FROM 
        "Ticket" t
      LEFT JOIN "TicketType" tt
        ON t."ticketTypeId" = tt."ticketTypeId"
      LEFT JOIN "Customer" c
        ON t."customerId" = c."customerId"
      LEFT JOIN "TeamMember" tm 
        ON t."teamMemberId" = tm."teamMemberId"
      LEFT JOIN "TicketStatus" ts 
        ON t."ticketStatusId" = ts."ticketStatusId"
      WHERE 
        "ticketId" = $1
      ORDER BY 
        t."ticketId" ASC
      `,
      [id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a ticket
const createTicket = async (req, res) => {
  // .. Creates a new ticket with a default status of "New"
  // ..Dynamically fetches the ticketStatusId for "New" from the TicketStatus table

  // ticketId is created serially via Postresql so no need to provide, createdAt via NOW() Method below
  const { ticketTypeId, teamMemberId, customerId, title, description } =
    req.body;

  console.log("Ticket: Request body POST:", req.body);
  try {
    // Fetch the ticketStatusId for "New" dynamically
    const { rows } = await pool.query(
      'SELECT "ticketStatusId" FROM "TicketStatus" WHERE "name" = $1',
      ["New"]
    );

    if (!rows.length) {
      // If no "New" status is found -> return error
      return res.status(400).json({
        message: 'Default status "New" not found in TicketStatus table',
      });
    }

    const ticketStatusId = rows[0].ticketStatusId;

    const result = await pool.query(
      'INSERT INTO "Ticket" ("ticketTypeId", "teamMemberId", "customerId", "ticketStatusId", "title", "description", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [
        ticketTypeId,
        teamMemberId,
        customerId,
        ticketStatusId,
        title,
        description,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a ticket
const updateTicket = async (req, res) => {
  const { id } = req.params;

  const {
    ticketTypeId,
    teamMemberId,
    customerId,
    ticketStatusId,
    title,
    description,
  } = req.body;

  console.log(`Ticket: Request PUT for ticketId: ${id}`, req.body);
  try {
    const result = await pool.query(
      'UPDATE "Ticket" SET "ticketTypeId" = $1, "teamMemberId" = $2, "customerId" = $3, "ticketStatusId" = $4, "title" = $5, "description" = $6 WHERE "ticketId" = $7 RETURNING *',
      [
        ticketTypeId,
        teamMemberId,
        customerId,
        ticketStatusId,
        title,
        description,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a ticket
const deleteTicket = async (req, res) => {
  const { id } = req.params;

  console.log("Ticket: Request Delete, ticketId: ", id);

  try {
    await pool.query('DELETE FROM "Ticket" WHERE "ticketId" = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
