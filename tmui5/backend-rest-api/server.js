const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ticketTypeRoute = require("./route/ticketTypeRoute"); //
const ticketRoute = require("./route/ticketRoute");
const ticketCommentRoute = require("./route/ticketCommentRoute"); //
const customerRoute = require("./route/customerRoute");
const roleRoute = require("./route/roleRoute"); //
const teamMemberRoute = require("./route/teamMemberRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/ticketTypes", ticketTypeRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/ticketComments", ticketCommentRoute);
app.use("/api/customers", customerRoute);
app.use("/api/roles", roleRoute);
app.use("/api/teamMembers", teamMemberRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the REST API for Ticket Management using Node.js!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// DB Connection check
const pool = require("./config/db");
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to DB. Current time:", res.rows[0]);
  }
});
