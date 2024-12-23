sap.ui.define([], function () {
  "use strict";

  return {
    fetchTicketStatuses: async function () {
      const response = await fetch("http://localhost:3000/api/ticketStatus", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Ticket Statuses: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  };
});
