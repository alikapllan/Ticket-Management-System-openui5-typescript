const express = require("express");
const router = express.Router();
const {
  getAllTickets,
  getFilteredTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controller/ticketController");

// define routes
router.get("/", getAllTickets); // GET all tickets, when Request GET, trigger getAllTickets Method in ticketController
router.get("/filtered", getFilteredTickets); // GET filtered Tickets -> must be placed before getTicket, otherwise getTicket triggered first as it is more generic
router.get("/:id", getTicket); // GET a single ticket
router.post("/", createTicket); // CREATE a ticket
router.put("/:id", updateTicket); // UPDATE a ticket
router.delete("/:id", deleteTicket); // DELETE a ticket

module.exports = router;
