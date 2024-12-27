sap.ui.define([], function () {
  "use strict";

  return {
    _sendEmail: async function (emailPayload) {
      try {
        const response = await fetch("http://localhost:3000/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }

        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    },
    sendTicketCreatedEmail: async function (ticketDetails) {
      const {
        ticketId,
        teamMemberEmail,
        teamMemberFullName,
        title,
        description,
      } = ticketDetails;

      const emailPayload = {
        to: teamMemberEmail,
        subject: `New Ticket Assigned: #${ticketId} - ${title}`,
        text: `Dear ${teamMemberFullName},\n\nA new ticket has been assigned to you.\n\nTicket ID: ${ticketId}\nTitle: ${title}\nDescription: ${description}\n\nBest regards,\nTicket Management System`,
      };

      return this._sendEmail(emailPayload);
    },

    sendTicketUpdatedEmail: async function (ticketDetails) {
      const {
        ticketId,
        teamMemberEmail,
        teamMemberFullName,
        title,
        description,
      } = ticketDetails;

      const emailPayload = {
        to: teamMemberEmail,
        subject: `Ticket Updated: #${ticketId} - ${title}`,
        text: `Dear ${teamMemberFullName},\n\nThe ticket "${title}" (ID: ${ticketId}) has been updated.\n\nDescription: ${description}\n\nBest regards,\nTicket Management System`,
      };

      return this._sendEmail(emailPayload);
    },
  };
});
