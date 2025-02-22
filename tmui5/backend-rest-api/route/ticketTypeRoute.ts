import { Router } from "express";
import { getAllTicketTypes } from "../controller/ticketTypeController";

const router: Router = Router();

router.get("/", getAllTicketTypes);

export default router;
