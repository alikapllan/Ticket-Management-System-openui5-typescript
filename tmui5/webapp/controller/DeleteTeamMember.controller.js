sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History, MessageBox) {
    "use strict";

    return BaseController.extend("tmui5.controller.DeleteTeamMember", {
      onInit: function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);

        // load team members from db
        this.loadTeamMembers();
      },

      onDeleteSelectedTeamMember: async function () {
        const oTable = this.byId("teamMembersTable");
        const aSelectedTeamMembers = oTable.getSelectedContexts(); // Get selected row/s

        if (!aSelectedTeamMembers.length) {
          MessageBox.error(
            this.oBundle.getText("MBoxSelectAtLeastOneTeamMember")
          );
          return;
        }

        // confirm delete operation of team member/s
        MessageBox.confirm(
          this.oBundle.getText("MBoxConfirmToDeleteTeamMember"),
          {
            icon: MessageBox.Icon.QUESTION,
            title: this.oBundle.getText(
              "MBoxConfirmationTitleToDeleteTeamMember"
            ),
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            emphasizedAction: MessageBox.Action.YES,
            onClose: async function (sAction) {
              if (sAction === MessageBox.Action.YES) {
                try {
                  // loop over selected rows
                  for (const oSelectedTeamMember of aSelectedTeamMembers) {
                    const oTeamMember = oSelectedTeamMember.getObject(); // get bound data for each Team Member
                    const iTeamMemberId = oTeamMember.teamMemberId;

                    // make DELETE Request for each selected Team Member to Rest API
                    await fetch(
                      `http://localhost:3000/api/teamMembers/${iTeamMemberId}`,
                      {
                        method: "DELETE",
                      }
                    );
                  }

                  // refresh Team Members on Table after deletion
                  await this.loadTeamMembers();
                  MessageBox.success(
                    this.oBundle.getText("MBoxSuccessOfDeletionTeamMember")
                  );
                } catch (error) {
                  console.log(error);
                  MessageBox.error(
                    this.oBundle.getText("MBoxErrorToDeleteTeamMember")
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
          this.navTo("RouteMainView");
        }
      },
    });
  }
);
