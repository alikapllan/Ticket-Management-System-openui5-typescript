const express = require("express");
const router = express.Router();
const {
  getAllTeamMembers,
  createTeamMember,
  deleteTeamMember,
} = require("../controller/teamMemberController");

// define routes
router.get("/", getAllTeamMembers);
router.post("/", createTeamMember);
router.delete("/:id", deleteTeamMember);

module.exports = router;
