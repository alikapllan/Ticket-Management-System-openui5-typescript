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

    fetchTicket: async function (iTicketId) {
      const response = await fetch(
        `http://localhost:3000/api/tickets/${iTicketId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Ticket: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },

    fetchFilteredTickets: async function (queryString) {
      const response = await fetch(
        `http://localhost:3000/api/tickets/filtered?${queryString}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Filtered Tickets: HTTP ${response.status}: ${response.statusText}`
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

    uploadFiles: async function (iTicketId, formData) {
      const response = await fetch(
        `http://localhost:3000/api/tickets/${iTicketId}/files`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `File upload failed! HTTP ${response.status}: ${response.statusText}`
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

    updateTickets: async function (iTicketId, oPayload) {
      const response = await fetch(
        `http://localhost:3000/api/tickets/${iTicketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // tells the server the body is JSON
          },
          body: JSON.stringify(oPayload),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Ticket Update Failed! HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  };
});
