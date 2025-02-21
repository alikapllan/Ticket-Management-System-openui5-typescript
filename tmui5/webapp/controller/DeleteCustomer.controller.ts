import BaseController from "./BaseController";
import History from "sap/ui/core/routing/History";
import MessageBox from "sap/m/MessageBox";
import customerService from "tmui5/services/customerService";
import Table from "sap/m/Table";

export default class DeleteCustomer extends BaseController {
  public async onInit(): Promise<void> {
    super.onInit(); // Call BaseController's onInit to initialize 'oBundle'
    await this.loadCustomers();
  }

  public async onDeleteSelectedCustomer(): Promise<void> {
    const oTable = this.byId("customersTable") as Table;
    const aSelectedCustomers = oTable.getSelectedContexts(); // Get selected row/s

    if (!aSelectedCustomers.length) {
      MessageBox.error(this.oBundle.getText("MBoxSelectAtLeastOneCustomer"));
      return;
    }

    // Confirm delete operation of customer/s
    MessageBox.confirm(this.oBundle.getText("MBoxConfirmToDeleteCustomer"), {
      title: this.oBundle.getText("MBoxConfirmationTitleToDeleteCustomer"),
      actions: [MessageBox.Action.YES, MessageBox.Action.NO],
      emphasizedAction: MessageBox.Action.YES,
      onClose: async (sAction: String) => {
        if (sAction === MessageBox.Action.YES) {
          try {
            // Loop over selected rows
            for (const oSelectedCustomer of aSelectedCustomers) {
              const iCustomerId = (
                oSelectedCustomer.getObject() as { customerId: number }
              ).customerId;

              // Make DELETE Request for each selected Customer to REST API
              await customerService.deleteCustomers(iCustomerId);
            }

            // Refresh Customers on Table after deletion
            await this.loadCustomers();

            MessageBox.success(
              this.oBundle.getText("MBoxSuccessOfDeletionCustomer")
            );
          } catch (error) {
            console.error(error);
            MessageBox.error(this.oBundle.getText("MBoxErrorToDeleteCustomer"));
          }
        } else {
          // Unselect the checkboxes of selected items if clicked on 'no'
          oTable.removeSelections(true);
        }
      },
    });
  }

  public onNavBack(): void {
    const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();

    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      this.navTo(this.Constants.ROUTES.MAIN);
    }
  }
}
