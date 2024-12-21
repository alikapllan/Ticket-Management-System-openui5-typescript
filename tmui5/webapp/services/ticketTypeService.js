sap.ui.define([], function () {
  "use strict";

  return {
    fetchTicketTypes: async function () {
      const response = await fetch("http://localhost:3000/api/ticketTypes", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Ticket Types: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  };
});
