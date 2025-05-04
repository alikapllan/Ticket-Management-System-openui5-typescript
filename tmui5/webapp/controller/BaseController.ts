import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Component from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import customerService from "tmui5/services/customerService";
import teamMemberService from "tmui5/services/teamMemberService";
import ticketService from "tmui5/services/ticketService";
import Constants from "tmui5/constants/Constants";
import coreLibrary from "sap/ui/core/library";

export default class BaseController extends Controller {
  protected Constants: typeof Constants; // Explicit type
  protected oBundle: any;
  protected ValueState: any;

  onInit(): void | undefined {
    this.Constants = Constants; // Explicitly assign Constants

    const oOwnerComponent = this.getOwnerComponent();
    const oI18nModel = oOwnerComponent.getModel("i18n") as ResourceModel;

    this.oBundle = oI18nModel.getResourceBundle();

    // https://sapui5.hana.ondemand.com/#/api/sap.ui.core.ValueState
    this.ValueState = coreLibrary.ValueState;
  }

  private getRouter() {
    return (this.getOwnerComponent() as Component).getRouter();
  }

  public navTo(sRoute: string): void {
    this.getRouter().navTo(sRoute, {}, true);
  }

  public async loadTeamMembers(): Promise<void> {
    try {
      const teamMembers = await teamMemberService.fetchTeamMembers();
      const oTeamMemberModel = new JSONModel(teamMembers);
      this.getOwnerComponent().setModel(oTeamMemberModel, "teamMemberModel");
    } catch (error) {
      console.error(error);
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTeamMember"));
    }
  }

  public async loadCustomers(): Promise<void> {
    try {
      const customers = await customerService.fetchCustomers();
      const oCustomerModel = new JSONModel(customers);
      this.getOwnerComponent().setModel(oCustomerModel, "customerModel");
    } catch (error) {
      console.error(error);
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnCustomer"));
    }
  }

  public async loadTickets(): Promise<void> {
    try {
      const tickets = await ticketService.fetchTickets();
      const oTicketModel = new JSONModel(tickets);
      this.getOwnerComponent().setModel(oTicketModel, "ticketModel");
    } catch (error) {
      console.error(error);
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTicket"));
    }
  }
}
