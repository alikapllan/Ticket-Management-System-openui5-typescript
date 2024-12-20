sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("tmui5.controller.MainView", {
      onInit: function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);
        // onInit lifecycle method in the child controller overrides the onInit of the parent (BaseController)

        // json binding for generic tiles
        const oTilesModel = new JSONModel("../model/tiles.json");
        this.getView().setModel(oTilesModel, "tiles");

        // Load roles --> no need to put it inside onOpenDialog as Roles are rarely changed
        this._loadRoles();
      },

      onPress: async function (sRoute, sFragment) {
        if (sRoute) {
          if (sRoute === "RouteDeleteTeamMember") {
            // Refresh team members to ensure new additions of Team Members are visible
            this.loadTeamMembers();
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

      _loadRoles: async function () {
        try {
          const response = await fetch("http://localhost:3000/api/roles", {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const roles = await response.json();

          // Bind the fetched role data to the "roleModel"
          const oRoleModel = new JSONModel(roles);
          this.getOwnerComponent().setModel(oRoleModel, "roleModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnRole"));
        }
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
          const response = await fetch(
            "http://localhost:3000/api/teamMembers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // tells the server the body is JSON
              },
              body: JSON.stringify(oPayload),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

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

          // Optionally, refresh team members
          this.loadTeamMembers();
        } catch (error) {
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxFailedToCreateTeamMember")
          );
        }
      },
    });
  }
);
