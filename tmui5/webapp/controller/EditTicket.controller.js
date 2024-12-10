sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    History,
    Fragment,
    Filter,
    FilterOperator,
    MessageToast
  ) {
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

      // Value Help 'Assigned To' - START
      onValueHelpRequestAssignedTo: function (oEvent) {
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();

        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "tmui5.view.valueHelpFragments.AssignedToValueHelp",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pValueHelpDialog.then(function (oDialog) {
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
        const oSource = oEvent.getSource();
        const oDialog = oSource.getParent();
        oDialog.close();
        oDialog.destroy();
      },
      // Value Help 'Assigned To' - END

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
