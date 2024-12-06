sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, MessageToast) {
    "use strict";

    return BaseController.extend("tmui5.controller.EditTicket", {
      onInit: function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);
        // onInit lifecycle method in the child controller overrides the onInit of the parent (BaseController)
      },

      onSaveTicket: function () {
        MessageToast.show(this.oBundle.getText("ticketEditedSuccessfully"));
        // wait 1 sec & Navigate back to the Ticket Overview Page
        setTimeout(
          function () {
            this.navTo("RouteTicketOverview");
          }.bind(this), // setTimeout callback refers to the controller instance
          1000
        );
      },

      onNavBack: function () {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.navTo("RouteTicketOverview");
        }
      },
    });
  }
);
