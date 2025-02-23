import { Router } from "express";
import {
  getAllTicketComments,
  createTicketComment,
} from "../controller/ticketCommentController.js";

const router: Router = Router();

router.get("/:id", getAllTicketComments); // GET all ticket comments for a specific ticket
router.post("/", createTicketComment);

/* 
    -> No need to define DELETE route:
    PostgreSQL handles deletion automatically due to 'ON DELETE CASCADE' 
    on the foreign key 'ticketId' in the 'TicketComment' table.
    This ensures that when a ticket is deleted, all related comments 
    are automatically removed by the database.
*/

// router.delete("/", deleteRelatedTicketComments);

export default router;
