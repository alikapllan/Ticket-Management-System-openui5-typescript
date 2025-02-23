import { Router } from "express";
import { getAllTicketTypes } from "../controller/ticketTypeController.js";

const router: Router = Router();

router.get("/", getAllTicketTypes);

export default router;
