import Integer from "sap/ui/model/type/Integer";

interface TicketDetails {
  ticketId: Integer;
  teamMemberEmail: string;
  teamMemberFullName: string;
  title: string;
  description: string;
}

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

export default class TicketEmailService {
  private static async _sendEmail(
    emailPayload: EmailPayload
  ): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `Email Sending Error: ${response.status} - ${
            errorBody.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error occured at sending email:", error);
      throw error;
    }
  }

  public static async sendTicketCreatedEmail(
    ticketDetails: TicketDetails
  ): Promise<boolean> {
    const {
      ticketId,
      teamMemberEmail,
      teamMemberFullName,
      title,
      description,
    } = ticketDetails;

    const emailPayload: EmailPayload = {
      to: teamMemberEmail,
      subject: `New Ticket Assigned: #${ticketId} - ${title}`,
      text: `Dear ${teamMemberFullName},\n\nA new ticket has been assigned to you.\n\nTicket ID: ${ticketId}\nTitle: ${title}\nDescription: ${description}\n\nBest regards,\nTicket Management System`,
    };

    return this._sendEmail(emailPayload);
  }

  public static async sendTicketUpdatedEmail(
    ticketDetails: TicketDetails
  ): Promise<boolean> {
    const {
      ticketId,
      teamMemberEmail,
      teamMemberFullName,
      title,
      description,
    } = ticketDetails;

    const emailPayload: EmailPayload = {
      to: teamMemberEmail,
      subject: `Ticket Updated: #${ticketId} - ${title}`,
      text: `Dear ${teamMemberFullName},\n\nThe ticket "${title}" (ID: ${ticketId}) has been updated.\n\nDescription: ${description}\n\nBest regards,\nTicket Management System`,
    };

    return this._sendEmail(emailPayload);
  }
}
