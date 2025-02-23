import { Router } from "express";
import {
  getAllCustomers,
  createCustomer,
  deleteCustomer,
} from "../controller/customerController.js";

// router instance
const router: Router = Router();

// Define routes
router.get("/", getAllCustomers);
router.post("/", createCustomer);
router.delete("/:id", deleteCustomer);

export default router;
