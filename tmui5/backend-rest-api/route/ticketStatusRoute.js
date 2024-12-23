const express = require("express");
const router = express.Router();
const {
  getAllTicketStatuses,
} = require("../controller/ticketStatusController");

// define route
router.get("/", getAllTicketStatuses); // GET all Ticket Statuses

module.exports = router;
