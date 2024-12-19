const express = require("express");
const router = express.Router();
const {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controller/ticketController");

// define routes
router.get("/", getAllTickets); // GET all tickets, when Request GET, trigger getAllTickets Method in ticketController
router.post("/", createTicket); // CREATE a ticket
router.put("/:id", updateTicket); // UPDATE a ticket
router.delete("/:id", deleteTicket); // DELETE a ticket

module.exports = router;
