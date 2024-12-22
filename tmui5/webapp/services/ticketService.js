sap.ui.define([], function () {
  "use strict";

  return {
    fetchTickets: async function () {
      const response = await fetch("http://localhost:3000/api/tickets", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Tickets: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },

    createTickets: async function (oPayload) {
      const response = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // tells the server the body is JSON
        },
        body: JSON.stringify(oPayload),
      });

      if (!response.ok) {
        throw new Error(
          `Ticket Creation Failed! HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },

    deleteTickets: async function (iTicketId) {
      const response = await fetch(
        `http://localhost:3000/api/tickets/${iTicketId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Ticket Deletion Failed! HTTP ${response.status}: ${response.statusText}`
        );
      }
      // no return response.json() , as no response for deletion in our case
    },
  };
});
