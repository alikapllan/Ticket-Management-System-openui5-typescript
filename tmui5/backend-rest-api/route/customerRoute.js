const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  createCustomer,
  deleteCustomer,
} = require("../controller/customerController");

// define routes
router.get("/", getAllCustomers);
router.post("/", createCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
