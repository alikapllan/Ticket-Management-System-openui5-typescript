const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getAllTickets,
  getFilteredTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  uploadFiles,
  getTicketFiles,
} = require("../controller/ticketController");

// Multer setup - to handle files upload
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage });

// define routes
router.get("/", getAllTickets); // GET all tickets, when Request GET, trigger getAllTickets Method in ticketController
router.get("/filtered", getFilteredTickets); // GET filtered Tickets -> must be placed before getTicket, otherwise getTicket triggered first as it is more generic
router.get("/:id", getTicket); // GET a single ticket
router.post("/", createTicket); // CREATE a ticket
router.put("/:id", updateTicket); // UPDATE a ticket
router.delete("/:id", deleteTicket); // DELETE a ticket
router.post("/:id/files", upload.array("files"), uploadFiles); // CREATE - Upload files (files are available as buffers, as saved in memory as Buffer obj.) in the request object (req.files))
router.get("/:id/files", getTicketFiles); // GET files for a specific ticket

module.exports = router;
