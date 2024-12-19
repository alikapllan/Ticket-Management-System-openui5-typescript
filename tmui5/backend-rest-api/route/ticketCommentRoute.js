const express = require("express");
const router = express.Router();
const {
  getAllTicketComments,
  createTicketComment,
} = require("../controller/ticketCommentController");

// define routes
router.get("/:id", getAllTicketComments); // GET all ticket comments
router.post("/", createTicketComment); // CREATE a ticket comment

/* 
    -> no need to define DELETE, as on PostreSQL the foreign key ticketId has ACTION 'On Delete'
    and selected as CASCADE, meaning, if a ticket is deleted, its comments are deleted automatically by postreSQL for table 'TicketComment'.
*/
// router.delete("/", deleteRelatedTicketComments);

module.exports = router;
