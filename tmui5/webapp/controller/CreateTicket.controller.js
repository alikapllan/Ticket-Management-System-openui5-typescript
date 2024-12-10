sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, Fragment, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("tmui5.controller.CreateTicket", {
      onInit: function () {
        const oTicketNumberInput = this.byId("ticketNumberInput");
        oTicketNumberInput.setValue("Dynamic Ticket Number will be here");

        const oEmailInput = this.byId("emailInput");
        oEmailInput.setValue("Email will be taken from 'assigned to'");
      },
      // Value Help 'Assigned To' - START
      onValueHelpRequestAssignedTo: function (oEvent) {
        let sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._pAssignedToValueHelpDialog) {
          this._pAssignedToValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "tmui5.view.valueHelpFragments.AssignedToValueHelp",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pAssignedToValueHelpDialog.then(function (oDialog) {
          // Create a filter for the binding
          // oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);

          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });
      },

      onValueHelpSearchAssignedTo: function (oEvent) {
        /*
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
  
        oEvent.getSource().getBinding("items").filter([oFilter]);
        */
      },

      onValueHelpCloseAssignedTo: function (oEvent) {
        /*
        var oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("assignedTo").filter([]);

        if (!oSelectedItem) {
          return;
        }

        this.byId("assignedToInput").setValue(oSelectedItem.getTitle()); */
        const oDialog = oEvent.getSource(); // get Dialog
        oDialog.destroy();
        this._pAssignedToValueHelpDialog = null; // allow recreation on next request
      },
      // Value Help 'Assigned To' - END

      // Value Help 'Customer' - START
      onValueHelpRequestCustomer: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._pCustomerValueHelpDialog) {
          this._pCustomerValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "tmui5.view.valueHelpFragments.CustomerValueHelp",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pCustomerValueHelpDialog.then(function (oDialog) {
          // Create a filter for the binding
          // oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);

          // Open ValueHelpDialog filtered by the input's value
          oDialog.open(sInputValue);
        });
      },

      onValueHelpSearchCustomer: function (oEvent) {},

      onValueHelpCloseCustomer: function (oEvent) {
        const oDialog = oEvent.getSource(); // get Dialog
        oDialog.destroy();
        this._pCustomerValueHelpDialog = null; // allow recreation on next request
      },
      // Value Help 'Customer' - END

      onNavBack: function () {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.navTo("RouteMainView");
        }
      },
    });
  }
);
