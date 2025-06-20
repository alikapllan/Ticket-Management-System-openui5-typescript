import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import customerService from "tmui5/services/customerService";
import teamMemberService from "tmui5/services/teamMemberService";
import Input from "sap/m/Input";
import Select from "sap/m/Select";
import Dialog from "sap/m/Dialog";
import Log from "sap/base/Log";

export default class MainView extends BaseController {
  public onInit(): void {
    super.onInit();
    const oTilesModel = new JSONModel("../model/tiles.json");
    this.getView().setModel(oTilesModel, "tiles");
  }

  public async onPress(sRoute?: string, sFragement?: string): Promise<void> {
    if (sRoute) {
      if (sRoute === this.Constants.ROUTES.TICKET_OVERVIEW) {
        await this.loadTickets();
      }
      if (sRoute === this.Constants.ROUTES.DELETE_TEAM_MEMBER) {
        await this.loadTeamMembers();
      }
      if (sRoute === this.Constants.ROUTES.DELETE_CUSTOMER) {
        await this.loadCustomers();
      }
      this.navTo(sRoute);
    } else if (sFragement) {
      this.onOpenDialog(sFragement);
    } else {
      MessageToast.show(this.oBundle.getText("noActionDefined"));
    }
  }

  public async onOpenDialog(sFragement?: string): Promise<void> {
    try {
      const oDialog = (await this.loadFragment({ name: sFragement })) as Dialog;
      oDialog.open();
    } catch (error) {
      Log.error("Failed to load fragment", error, "tmui5.controller.MainView");
      MessageToast.show(this.oBundle.getText("failedFragmentLoad"));
    }
  }

  public onCloseDialog(oEvent: any): void {
    const oSource = oEvent.getSource();
    const oDialog = oSource.getParent();
    oDialog.close();
    oDialog.destroy();
  }

  public onCreateTeamMember(): void {
    this._createTeamMemberPOST();
  }

  private async _createTeamMemberPOST(): Promise<void> {
    const oView = this.getView();
    const sName = (oView.byId("teamMemberNameInput") as Input).getValue();
    const sSurname = (oView.byId("teamMemberSurnameInput") as Input).getValue();
    const sRoleId = (
      oView.byId("teamMemberRoleInput") as Select
    ).getSelectedKey();
    const sEmail = (oView.byId("teamMemberEmailInput") as Input).getValue();
    const sPhone = (oView.byId("teamMemberPhoneInput") as Input).getValue();

    if (!sName || !sSurname || !sRoleId || !sEmail || !sPhone) {
      MessageBox.error(this.oBundle.getText("MBoxFillAllFields"));
      return;
    }

    const oPayload = {
      name: sName,
      surname: sSurname,
      roleId: parseInt(sRoleId),
      email: sEmail,
      phone: sPhone,
    };

    try {
      await teamMemberService.createTeamMembers(oPayload);
      MessageBox.success(
        this.oBundle.getText("MBoxTeamMemberCreatedSuccessfully"),
        {
          onClose: () => {
            const oFragment = oView.byId("createTeamMemberDialog") as Dialog;
            oFragment.attachEventOnce("afterClose", () => oFragment.destroy());
            oFragment.close();
          },
        }
      );
    } catch (error) {
      Log.error(
        "Failed to create team member",
        error,
        "tmui5.controller.MainView"
      );
      MessageBox.error(this.oBundle.getText("MBoxFailedToCreateTeamMember"));
    }
  }

  public async onCreateCustomer(): Promise<void> {
    await this._createCustomerPOST();
  }

  private async _createCustomerPOST(): Promise<void> {
    const oView = this.getView();
    const sName = (oView.byId("customerNameInput") as Input).getValue();
    const sEmail = (oView.byId("customerEmailInput") as Input).getValue();
    const sPhone = (oView.byId("customerPhoneInput") as Input).getValue();

    if (!sName || !sEmail || !sPhone) {
      MessageBox.error(this.oBundle.getText("MBoxFillAllFields"));
      return;
    }

    const oPayload = {
      name: sName,
      email: sEmail,
      phone: sPhone,
    };

    try {
      await customerService.createCustomers(oPayload);
      MessageBox.success(
        this.oBundle.getText("MBoxCustomerCreatedSuccessfully"),
        {
          onClose: () => {
            const oFragment = oView.byId("createCustomerDialog") as Dialog;
            oFragment.attachEventOnce("afterClose", () => oFragment.destroy());
            oFragment.close();
          },
        }
      );
    } catch (error) {
      Log.error(
        "Failed to create customer",
        error,
        "tmui5.controller.MainView"
      );
      MessageBox.error(this.oBundle.getText("MBoxFailedToCreateCustomer"));
    }
  }
}
