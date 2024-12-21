sap.ui.define([], function () {
  "use strict";

  return {
    fetchCustomers: async function () {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Customers: ${response.statusText}`);
      }

      return response.json();
    },

    createCustomers: async function (oPayload) {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // tells the server the body is JSON
        },
        body: JSON.stringify(oPayload),
      });

      if (!response.ok) {
        throw new Error(
          `Customer Creation Failed! HTTP Error Status: ${response.status}`
        );
      }

      return response.json();
    },

    deleteCustomers: async function (iCustomerId) {
      const response = await fetch(
        `http://localhost:3000/api/customers/${iCustomerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Customer Deletion Failed! HTTP ${response.status}: ${response.statusText}`
        );
      }
      // no return response.json() , as no response for deletion in our case
    },
  };
});
