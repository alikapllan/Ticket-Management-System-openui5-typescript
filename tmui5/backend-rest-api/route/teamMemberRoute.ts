import { Router } from "express";
import {
  getAllTeamMembers,
  createTeamMember,
  deleteTeamMember,
} from "../controller/teamMemberController.js";

const router: Router = Router();

router.get("/", getAllTeamMembers);
router.post("/", createTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
