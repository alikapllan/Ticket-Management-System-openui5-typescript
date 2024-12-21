sap.ui.define([], function () {
  "use strict";

  return {
    fetchRoles: async function () {
      const response = await fetch("http://localhost:3000/api/roles", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Roles: HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },
  };
});
