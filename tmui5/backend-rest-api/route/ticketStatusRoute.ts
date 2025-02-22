import { Router } from "express";
import { getAllTicketStatuses } from "../controller/ticketStatusController";

const router: Router = Router();

router.get("/", getAllTicketStatuses);

export default router;
