const pool = require("../config/db");

// GET all tickets
const getAllTickets = async (req, res) => {
  console.log("Ticket: Request GET");
  try {
    const result = await pool.query(
      'SELECT * FROM "Ticket" ORDER BY "ticketId" ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a ticket
const createTicket = async (req, res) => {
  // ticketId is created serially via Postresql so no need to provide, createdAt via NOW() Method below
  const { ticketTypeId, teamMemberId, customerId, title, description } =
    req.body;

  console.log("Ticket: Request body POST:", req.body);
  try {
    const result = await pool.query(
      'INSERT INTO "Ticket" ("ticketTypeId", "teamMemberId", "customerId", "title", "description", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [ticketTypeId, teamMemberId, customerId, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a ticket
const updateTicket = async (req, res) => {
  const { id } = req.params;

  const { ticketTypeId, teamMemberId, customerId, title, description } =
    req.body;

  console.log("Ticket: Request body PUT:", req.body);
  try {
    const result = await pool.query(
      'UPDATE "Ticket" SET "ticketTypeId" = $1, "teamMemberId" = $2, "customerId" = $3, "title" = $4, "description" = $5 WHERE "ticketId" = $6 RETURNING *',
      [ticketTypeId, teamMemberId, customerId, title, description, id]
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

module.exports = { getAllTickets, createTicket, updateTicket, deleteTicket };
