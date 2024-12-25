sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "tmui5/services/customerService",
    "tmui5/services/teamMemberService",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    JSONModel,
    MessageToast,
    MessageBox,
    customerService,
    teamMemberService
  ) {
    "use strict";

    return BaseController.extend("tmui5.controller.MainView", {
      onInit: function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);
        // onInit lifecycle method in the child controller overrides the onInit of the parent (BaseController)

        // json binding for generic tiles
        const oTilesModel = new JSONModel("../model/tiles.json");
        this.getView().setModel(oTilesModel, "tiles");
      },

      onPress: async function (sRoute, sFragment) {
        if (sRoute) {
          if (sRoute === "RouteTicketOverview") {
            // Refresh tickets to ensure new additions of tickets are visible
            await this.loadTickets();
          }

          if (sRoute === "RouteDeleteTeamMember") {
            await this.loadTeamMembers();
          }

          if (sRoute === "RouteDeleteCustomer") {
            await this.loadCustomers();
          }

          this.navTo(sRoute);
        } else if (sFragment) {
          // fragment
          this.onOpenDialog(sFragment);
        } else {
          MessageToast.show(this.oBundle.getText("noActionDefined"));
        }
      },

      onOpenDialog: async function (sFragment) {
        try {
          const oDialog = await this.loadFragment({
            name: sFragment,
          });

          oDialog.open();
        } catch (error) {
          console.log(error);
          MessageToast.show(this.oBundle.getText("failedFragmentLoad"));
        }
      },

      onCloseDialog: function (oEvent) {
        // get the source of button that triggered the event
        const oSource = oEvent.getSource();
        // find parent dialog from that button
        const oDialog = oSource.getParent();

        oDialog.close();

        oDialog.destroy(); // to avoid duplicate IDs when loading same dialog
      },

      // fragment CreateTeamMember
      onCreateTeamMember: function () {
        this._createTeamMemberPOST();
      },

      _createTeamMemberPOST: async function () {
        // Get input field values from the fragment
        const oView = this.getView();
        const sName = oView.byId("teamMemberNameInput").getValue();
        const sSurname = oView.byId("teamMemberSurnameInput").getValue();
        const sRoleId = oView.byId("teamMemberRoleInput").getSelectedKey();
        const sEmail = oView.byId("teamMemberEmailInput").getValue();
        const sPhone = oView.byId("teamMemberPhoneInput").getValue();

        // Validate inputs
        if (!sName || !sSurname || !sRoleId || !sEmail || !sPhone) {
          MessageBox.error(this.oBundle.getText("MBoxFillAllFields"));
          return;
        }

        // Prepare payload to pass to POST
        const oPayload = {
          name: sName,
          surname: sSurname,
          roleId: parseInt(sRoleId),
          email: sEmail,
          phone: sPhone,
        };

        // Send POST request
        try {
          await teamMemberService.createTeamMembers(oPayload);

          // Success
          MessageBox.success(
            this.oBundle.getText("MBoxTeamMemberCreatedSuccessfully"),
            {
              onClose: function () {
                // Destroy fragment
                const oFragmentCreateTeamMember = oView.byId(
                  "createTeamMemberDialog"
                );
                // Attach event listener to handle cleanup after closing
                oFragmentCreateTeamMember.attachEventOnce(
                  "afterClose",
                  function () {
                    oFragmentCreateTeamMember.destroy(); // Destroy after close is complete
                  }
                );
                oFragmentCreateTeamMember.close();
              },
            }
          );
        } catch (error) {
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxFailedToCreateTeamMember")
          );
        }
      },

      // fragment CreateCustomer
      onCreateCustomer: async function () {
        await this._createCustomerPOST();
      },

      _createCustomerPOST: async function () {
        // Get input field values from fragment
        const oView = this.getView();
        const sName = oView.byId("customerNameInput").getValue();
        const sEmail = oView.byId("customerEmailInput").getValue();
        const sPhone = oView.byId("customerPhoneInput").getValue();

        // Validate inputs
        if (!sName || !sEmail || !sPhone) {
          MessageBox.error(this.oBundle.getText("MBoxFillAllFields"));
          return;
        }

        // Prepare Payload to pass to POST request
        const oPayload = {
          name: sName,
          email: sEmail,
          phone: sPhone,
        };

        // Send POST request to create Customer
        try {
          await customerService.createCustomers(oPayload);

          MessageBox.success(
            this.oBundle.getText("MBoxCustomerCreatedSuccessfully"),
            {
              onClose: function () {
                // Destroy fragment
                const oFragmentCreateCustomer = oView.byId(
                  "createCustomerDialog"
                );
                // Attach event listener to handle cleanup after closing
                oFragmentCreateCustomer.attachEventOnce(
                  "afterClose",
                  function () {
                    oFragmentCreateCustomer.destroy(); // Destroy after close is complete
                  }
                );
                oFragmentCreateCustomer.close();
              },
            }
          );
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxFailedToCreateCustomer"));
        }
      },
    });
  }
);
