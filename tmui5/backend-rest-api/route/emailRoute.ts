import { Router, Request, Response } from "express";
import { sendEmail } from "../controller/emailController.js";

const router: Router = Router();

interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

router.post("/", async (req: Request<{}, {}, EmailPayload>, res: Response) => {
  const { to, subject, text = "", html = "" } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const isSent = await sendEmail({ to, subject, text, html });
    if (isSent) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send email" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
