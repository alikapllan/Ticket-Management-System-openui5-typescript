sap.ui.define([], function () {
  "use strict";

  return {
    createTicketComment: async function (oPayload) {
      const response = await fetch("http://localhost:3000/api/ticketComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // tells the server the body is JSON
        },
        body: JSON.stringify(oPayload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create ticket comment: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  };
});
