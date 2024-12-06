sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History, Fragment, Filter, FilterOperator, Token) {
    "use strict";

    return Controller.extend("tmui5.controller.TicketOverview", {
      onInit: function () {},

      onTicketNumberValueHelp: function (oEvent) {
        let sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        // create value help dialog
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "tmui5.view.valueHelpFragments.TicketIdValueHelp",
            controller: this,
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }

        this._pValueHelpDialog.then(function (oValueHelpDialog) {
          // create a filter for the binding
          /*
          oValueHelpDialog
            .getBinding("items")
            .filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
          */
          // open value help dialog filtered by the input value
          oValueHelpDialog.open(sInputValue);
        });
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
