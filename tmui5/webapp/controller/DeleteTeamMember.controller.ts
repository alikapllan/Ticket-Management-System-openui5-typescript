import BaseController from "./BaseController";
import History from "sap/ui/core/routing/History";
import MessageBox from "sap/m/MessageBox";
import Table from "sap/m/Table";
import teamMemberService from "tmui5/services/teamMemberService";

export default class DeleteTeamMember extends BaseController {
  public async onInit(): Promise<void> {
    super.onInit();
    await this.loadTeamMembers();
  }

  public async onDeleteSelectedTeamMember(): Promise<void> {
    const oTable = this.byId("teamMembersTable") as Table;
    const aSelectedTeamMembers = oTable.getSelectedContexts(); // Get selected row/s

    if (!aSelectedTeamMembers.length) {
      MessageBox.error(this.oBundle.getText("MBoxSelectAtLeastOneTeamMember"));
      return;
    }

    // Confirm delete operation of selected team members/s
    MessageBox.confirm(this.oBundle.getText("MBoxConfirmToDeleteTeamMember"), {
      title: this.oBundle.getText("MBoxConfirmationTitleToDeleteTeamMember"),
      actions: [MessageBox.Action.YES, MessageBox.Action.NO],
      emphasizedAction: MessageBox.Action.YES,
      onClose: async (sAction: String) => {
        if (sAction === MessageBox.Action.YES) {
          try {
            for (const oSelectedTeamMember of aSelectedTeamMembers) {
              const iTeamMemberId = (
                oSelectedTeamMember.getObject() as { teamMemberId: number }
              ).teamMemberId;

              // DELETE request to API
              await teamMemberService.deleteTeamMembers(iTeamMemberId);
            }

            // Refresh team members on table
            await this.loadTeamMembers();
            MessageBox.success(
              this.oBundle.getText("MBoxSuccessOfDeletionTeamMember")
            );
          } catch (error) {
            console.error(error);
            MessageBox.error(
              this.oBundle.getText("MBoxErrorToDeleteTeamMember")
            );
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
