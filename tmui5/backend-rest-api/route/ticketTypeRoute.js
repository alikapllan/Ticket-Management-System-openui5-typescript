const express = require("express");
const router = express.Router();
const { getAllTicketTypes } = require("../controller/ticketTypeController");

// define route
router.get("/", getAllTicketTypes); // GET all ticket types

module.exports = router;
