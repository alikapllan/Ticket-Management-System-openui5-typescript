import { Router } from "express";
import { getAllRoles } from "../controller/roleController";

const router: Router = Router();

router.get("/", getAllRoles); // GET all roles

export default router;
