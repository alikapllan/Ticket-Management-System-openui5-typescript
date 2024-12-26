const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ticketTypeRoute = require("./route/ticketTypeRoute"); //
const ticketRoute = require("./route/ticketRoute");
const ticketCommentRoute = require("./route/ticketCommentRoute"); //
const customerRoute = require("./route/customerRoute");
const ticketStatusRoute = require("./route/ticketStatusRoute");
const roleRoute = require("./route/roleRoute"); //
const teamMemberRoute = require("./route/teamMemberRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors()); // allows the server to accept requests from different domains or ports like my frontend(http://localhost:8080)
app.use(express.json()); // Parse JSON bodies -> parses incoming requests with JSON payloads and makes data avaliable via req.body

// Routes
app.use("/api/ticketTypes", ticketTypeRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/ticketComments", ticketCommentRoute);
app.use("/api/customers", customerRoute);
app.use("/api/ticketStatus", ticketStatusRoute);
app.use("/api/roles", roleRoute);
app.use("/api/teamMembers", teamMemberRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the REST API for Ticket Management using Node.js!");
});

// Start the server / PORT listening for incoming HTTP reqs, app is accessible on http://localhost:PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// DB Connection check
const pool = require("./config/db");
// "SELECT NOW()::timestamp" -> in pg : timestamp without timezone
pool.query("SELECT NOW()::timestamp", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to DB. Current time:", res.rows[0]);
  }
});
