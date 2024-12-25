const pool = require("../config/db");

// GET all ticket statuses from db
const getAllTicketStatuses = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTicketStatuses };
