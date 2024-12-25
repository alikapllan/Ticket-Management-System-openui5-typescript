sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "tmui5/services/customerService",
    "tmui5/services/teamMemberService",
    "tmui5/services/ticketService",
    "tmui5/services/ticketStatusService",
  ],
  function (
    Controller,
    JSONModel,
    MessageBox,
    customerService,
    teamMemberService,
    ticketService,
    ticketStatusService
  ) {
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
       * Fetches & loads team members through the REST API.
       */
      loadTeamMembers: async function () {
        try {
          const teamMembers = await teamMemberService.fetchTeamMembers();
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

      /**
       * @public
       * Fetches & loads customers through the REST API.
       */
      loadCustomers: async function () {
        try {
          const customers = await customerService.fetchCustomers();
          const oCustomerModel = new JSONModel(customers);
          this.getOwnerComponent().setModel(oCustomerModel, "customerModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnCustomer"));
        }
      },

      /**
       * @public
       * Fetches & loads tickets through the REST API.
       */
      loadTickets: async function () {
        try {
          const tickets = await ticketService.fetchTickets();
          const oTicketModel = new JSONModel(tickets);
          this.getOwnerComponent().setModel(oTicketModel, "ticketModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTicket"));
        }
      },

      /**
       * @public
       * Fetches & loads tickets through the REST API.
       */
      loadTicketStatuses: async function () {
        try {
          const tickets = await ticketStatusService.fetchTicketStatuses();
          const oTicketStatusModel = new JSONModel(tickets);
          this.getOwnerComponent().setModel(
            oTicketStatusModel,
            "ticketStatusModel"
          );
        } catch (error) {
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxGETReqFailedOnTicketStatus")
          );
        }
      },
    });
  }
);
