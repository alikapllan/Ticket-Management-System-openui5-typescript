sap.ui.define([], function () {
  "use strict";

  return {
    fetchTeamMembers: async function () {
      const response = await fetch("http://localhost:3000/api/teamMembers", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Team Members: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },

    createTeamMembers: async function (oPayload) {
      const response = await fetch("http://localhost:3000/api/teamMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // tells the server the body is JSON
        },
        body: JSON.stringify(oPayload),
      });

      if (!response.ok) {
        throw new Error(
          `Team Member Creation Failed! HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },

    deleteTeamMembers: async function (iTeamMemberId) {
      const response = await fetch(
        `http://localhost:3000/api/teamMembers/${iTeamMemberId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Team Member Deletion Failed! HTTP ${response.status}: ${response.statusText}`
        );
      }
      // no return response.json() , as no response for deletion in our case
    },
  };
});
