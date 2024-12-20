sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("tmui5.controller.BaseController", {
      onInit: function () {
        // Initialize the i18n resource bundle
        this.oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
      },
      /**
       * @private
       */
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },
      /**
       * @public
       */
      navTo: function (sRoute) {
        this.getRouter().navTo(sRoute, {}, true);
      },

      /**
       * @public
       * Fetches & loads the team members from the REST API.
       */
      loadTeamMembers: async function () {
        try {
          const response = await fetch(
            "http://localhost:3000/api/teamMembers",
            {
              method: "GET", // Fetch team members from the REST API - specifying type of Req. here
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const teamMembers = await response.json();

          // Bind the fetched data to the "teamMemberModel"
          const oTeamMemberModel = new JSONModel(teamMembers);
          this.getOwnerComponent().setModel(
            oTeamMemberModel,
            "teamMemberModel"
          );
        } catch (error) {
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxGETReqFailedOnTeamMember")
          );
        }
      },
    });
  }
);
