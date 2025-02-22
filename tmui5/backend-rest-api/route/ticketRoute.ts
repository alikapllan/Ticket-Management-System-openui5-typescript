import { Router } from "express";
import multer, { StorageEngine } from "multer";
import {
  getAllTickets,
  getFilteredTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  uploadFiles,
  getTicketFiles,
} from "../controller/ticketController";

const router: Router = Router();

// Multer setup - to handle file uploads
const storage: StorageEngine = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage });

router.get("/", getAllTickets);
router.get("/filtered", getFilteredTickets);
router.get("/:id", getTicket);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

// File upload and retrieval routes
router.post("/:id/files", upload.array("files"), uploadFiles);
router.get("/:id/files", getTicketFiles);

export default router;
