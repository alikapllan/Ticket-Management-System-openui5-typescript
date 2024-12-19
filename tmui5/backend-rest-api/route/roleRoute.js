const express = require("express");
const router = express.Router();
const { getAllRoles } = require("../controller/roleController");

// define route
router.get("/", getAllRoles); // GET all ticket types

module.exports = router;
