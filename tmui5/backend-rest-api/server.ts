import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import ticketTypeRoute from "./route/ticketTypeRoute.js";
import ticketRoute from "./route/ticketRoute.js";
import ticketCommentRoute from "./route/ticketCommentRoute.js";
import customerRoute from "./route/customerRoute.js";
import ticketStatusRoute from "./route/ticketStatusRoute.js";
import roleRoute from "./route/roleRoute.js";
import teamMemberRoute from "./route/teamMemberRoute.js";
import emailRoute from "./route/emailRoute.js";

import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
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
app.use("/api/send-email", emailRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the REST API for Ticket Management using Node.js!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// DB Connection check
// "SELECT NOW()::timestamp" -> in pg : timestamp without timezone
pool.query("SELECT NOW()::timestamp", (err: any, res: { rows: any[] }) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to DB. Current time:", res.rows[0]);
  }
});
