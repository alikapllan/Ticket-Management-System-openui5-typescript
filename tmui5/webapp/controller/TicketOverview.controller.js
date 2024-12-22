sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "tmui5/services/ticketService",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    History,
    JSONModel,
    Fragment,
    MessageBox,
    Filter,
    FilterOperator,
    Token,
    ticketService
  ) {
    "use strict";

    return BaseController.extend("tmui5.controller.TicketOverview", {
      onInit: async function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);

        await this._loadTickets();
      },

      onCreateTicket: function () {
        this.navTo("RouteCreateTicket");
      },

      onEditTicket: function () {
        this.navTo("RouteEditTicket");
      },

      onDeleteSelectedTickets: function () {
        const oTable = this.byId("ticketsTable");
        const aSelectedTickets = oTable.getSelectedContexts(); // Get selected row/s

        if (!aSelectedTickets.length) {
          MessageBox.error(this.oBundle.getText("MBoxSelectAtLeastOneTicket"));
          return;
        }

        // confirm delete operation of ticket/s
        MessageBox.confirm(this.oBundle.getText("MBoxConfirmToDeleteTicket"), {
          icon: MessageBox.Icon.QUESTION,
          title: this.oBundle.getText("MBoxConfirmationTitleToDeleteTicket"),
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          emphasizedAction: MessageBox.Action.YES,
          onClose: async function (sAction) {
            if (sAction === MessageBox.Action.YES) {
              try {
                // loop over selected rows
                for (const oSelectedTicket of aSelectedTickets) {
                  const oTicket = oSelectedTicket.getObject(); // get bound data for each Customer
                  const iTicketId = oTicket.ticketId;

                  // make DELETE Request for each selected Customer to Rest API
                  await ticketService.deleteTickets(iTicketId);
                }

                // refresh Customers on Table after deletion
                await this._loadTickets();

                MessageBox.success(
                  this.oBundle.getText("MBoxSuccessOfDeletionTicket")
                );
              } catch (error) {
                console.log(error);
                MessageBox.error(
                  this.oBundle.getText("MBoxErrorToDeleteTicket")
                );
                return;
              }
            }
            // MessageBox.Action.NO
            else {
              // unselect the checkboxes of selected items if clicked on click 'no'
              oTable.removeSelections(true);
            }
          }.bind(this),
        });
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

      _loadTickets: async function () {
        try {
          const tickets = await ticketService.fetchTickets();
          const oTicketModel = new JSONModel(tickets);
          this.getOwnerComponent().setModel(oTicketModel, "ticketModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTicket"));
        }
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
