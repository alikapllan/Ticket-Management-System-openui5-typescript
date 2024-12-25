const pool = require("../config/db");

// GET all ticket types from db
const getAllTicketTypes = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTicketTypes };
