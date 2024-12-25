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

        // Attach handler for when the TicketOverview is matched
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteTicketOverview")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: async function (oEvent) {
        await this.loadTickets();
        await this.loadTicketStatuses();

        this._removePreviousTicketSelections();
      },

      _removePreviousTicketSelections: function () {
        this.byId("ticketsTable").removeSelections(true);
      },

      onCreateTicket: function () {
        this.navTo("RouteCreateTicket");
      },

      onEditTicket: async function () {
        const oTable = this.byId("ticketsTable");
        const aSelectedItems = oTable.getSelectedContexts();

        if (aSelectedItems.length !== 1) {
          MessageBox.error(
            this.oBundle.getText("MBoxErrorSelectOnlyOneTicketToEdit")
          );
          return;
        }

        const oSelectedTicket = aSelectedItems[0].getObject(); // get the bound data
        const sTicketId = oSelectedTicket.ticketId;

        // Navigate to the EditTicket page with ticketId as parameter
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteEditTicket", {
          ticketId: sTicketId,
        });
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
                await this.loadTickets();

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

      onEditTicketNavigation: async function (oEvent) {
        const oTable = this.byId("ticketsTable");
        const aSelectedItems = oTable.getSelectedContexts();

        // Prevent navigation if any rows are selected -> if selected, user should use 'Edit' button to edit
        if (aSelectedItems.length > 0) {
          MessageBox.warning(
            this.oBundle.getText("MBoxNavigationDisabledDueToSelection")
          );
          return;
        }

        // Get the binding context of the clicked row
        const oSelectedItem = oEvent.getSource();
        const oBindingContext = oSelectedItem.getBindingContext("ticketModel");

        if (!oBindingContext) {
          MessageBox.error(
            this.oBundle.getText("MBoxTicketDetailsNotFoundToEdit")
          );
          return;
        }

        const sTicketId = oBindingContext.getProperty("ticketId");

        // Navigate to the EditTicket page with ticketId as parameter
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteEditTicket", {
          ticketId: sTicketId,
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
