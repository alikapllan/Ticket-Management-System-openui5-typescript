sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "tmui5/services/customerService",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, MessageBox, customerService) {
    "use strict";

    return BaseController.extend("tmui5.controller.DeleteCustomer", {
      onInit: async function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);

        await this.loadCustomers();
      },

      onDeleteSelectedCustomer: async function () {
        const oTable = this.byId("teamCustomersTable");
        const aSelectedCustomers = oTable.getSelectedContexts(); // Get selected row/s

        if (!aSelectedCustomers.length) {
          MessageBox.error(
            this.oBundle.getText("MBoxSelectAtLeastOneCustomer")
          );
          return;
        }

        // confirm delete operation of team member/s
        MessageBox.confirm(
          this.oBundle.getText("MBoxConfirmToDeleteCustomer"),
          {
            icon: MessageBox.Icon.QUESTION,
            title: this.oBundle.getText(
              "MBoxConfirmationTitleToDeleteCustomer"
            ),
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            emphasizedAction: MessageBox.Action.YES,
            onClose: async function (sAction) {
              if (sAction === MessageBox.Action.YES) {
                try {
                  // loop over selected rows
                  for (const oSelectedCustomer of aSelectedCustomers) {
                    const oCustomer = oSelectedCustomer.getObject(); // get bound data for each Customer
                    const iCustomerId = oCustomer.customerId;

                    // make DELETE Request for each selected Customer to Rest API
                    await customerService.deleteCustomers(iCustomerId);
                  }

                  // refresh Customers on Table after deletion
                  await this.loadCustomers();

                  MessageBox.success(
                    this.oBundle.getText("MBoxSuccessOfDeletionCustomer")
                  );
                } catch (error) {
                  console.log(error);
                  MessageBox.error(
                    this.oBundle.getText("MBoxErrorToDeleteCustomer")
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
          }
        );
      },

      onNavBack: function () {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.navTo(this.Constants.ROUTES.MAIN);
        }
      },
    });
  }
);
