sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, Fragment, Filter, FilterOperator, Token) {
    "use strict";

    return BaseController.extend("tmui5.controller.TicketOverview", {
      onInit: function () {},

      onEditTicket: function () {
        this.navTo("RouteEditTicket");
      },

      onTicketIdValueHelp: function (oEvent) {
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

      _onTicketIdValueHelpSearch: function (evt) {
        /*
			let sValue = evt.getParameter("value");
			let oFilter = new Filter(
				"Name",
				FilterOperator.Contains,
				sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]); 
        */
      },

      _onTicketIdValueHelpClose: function (evt) {
        /*
			let aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = this.byId("multiTicketIdInput");

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
						text: oItem.getTitle()
					}));
				});
			}
        */
      },

      onCreateTicket: function () {
        this.navTo("RouteCreateTicket");
      },

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
