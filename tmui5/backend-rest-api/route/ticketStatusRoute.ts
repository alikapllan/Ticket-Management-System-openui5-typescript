import { Router } from "express";
import { getAllTicketStatuses } from "../controller/ticketStatusController.js";

const router: Router = Router();

router.get("/", getAllTicketStatuses);

export default router;
