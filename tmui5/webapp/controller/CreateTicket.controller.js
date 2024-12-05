sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History) {
    "use strict";

    return Controller.extend("tmui5.controller.CreateTicket", {
      onInit: function () {
        const oTicketNumberInput = this.byId("ticketNumberInput");
        oTicketNumberInput.setValue("Dynamic Ticket Number will be here");

        const oEmailInput = this.byId("emailInput");
        oEmailInput.setValue("Email will be taken from 'assigned to'");
      },

      onNavBack: function () {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteMainView", {}, true);
        }
      },
    });
  }
);
