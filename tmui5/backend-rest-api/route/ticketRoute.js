const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getAllTickets,
  getFilteredTickets,
  getTicket,
  createTicket,
  uploadFiles,
  updateTicket,
  deleteTicket,
} = require("../controller/ticketController");

// Multer setup
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage });

// define routes
router.get("/", getAllTickets); // GET all tickets, when Request GET, trigger getAllTickets Method in ticketController
router.get("/filtered", getFilteredTickets); // GET filtered Tickets -> must be placed before getTicket, otherwise getTicket triggered first as it is more generic
router.get("/:id", getTicket); // GET a single ticket
router.post("/", createTicket); // CREATE a ticket
router.post("/:id/files", upload.array("files"), uploadFiles); // CREATE - Upload files
router.put("/:id", upload.single("file"), updateTicket); // UPDATE a ticket
router.delete("/:id", deleteTicket); // DELETE a ticket

module.exports = router;
