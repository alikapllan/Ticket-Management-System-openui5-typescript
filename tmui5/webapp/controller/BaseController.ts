import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import customerService from "tmui5/services/customerService";
import teamMemberService from "tmui5/services/teamMemberService";
import ticketService from "tmui5/services/ticketService";
import Constants from "tmui5/constants/Constants";
import { ValueState } from "sap/ui/core/library";
import Log from "sap/base/Log";

interface NavParameters {
  [key: string]: string | number | boolean; // key can be any string, value can be string, number, or boolean
}

export default class BaseController extends Controller {
  protected Constants: typeof Constants; // Explicit type
  protected oBundle: any;
  protected ValueState: typeof ValueState;

  onInit(): void | undefined {
    this.Constants = Constants; // Explicitly assign Constants

    const oOwnerComponent = this.getOwnerComponent();
    const oI18nModel = oOwnerComponent.getModel("i18n") as ResourceModel;

    this.oBundle = oI18nModel.getResourceBundle();

    // https://sapui5.hana.ondemand.com/#/api/sap.ui.core.ValueState
    this.ValueState = ValueState;
  }

  private getRouter() {
    return UIComponent.getRouterFor(this);
  }

  public navTo(sRoute: string, parameters: NavParameters = {}): void {
    const replaceCurrentPage = true; // replace current page in history
    this.getRouter().navTo(sRoute, parameters, replaceCurrentPage);
  }

  public async loadTeamMembers(): Promise<void> {
    try {
      const teamMembers = await teamMemberService.fetchTeamMembers();
      const oTeamMemberModel = new JSONModel(teamMembers);
      this.getOwnerComponent().setModel(oTeamMemberModel, "teamMemberModel");
    } catch (error) {
      Log.error(
        "Failed to fetch team members",
        error,
        "tmui5.controller.BaseController"
      );
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTeamMember"));
    }
  }

  public async loadCustomers(): Promise<void> {
    try {
      const customers = await customerService.fetchCustomers();
      const oCustomerModel = new JSONModel(customers);
      this.getOwnerComponent().setModel(oCustomerModel, "customerModel");
    } catch (error) {
      Log.error(
        "Failed to fetch customers",
        error,
        "tmui5.controller.BaseController"
      );
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnCustomer"));
    }
  }

  public async loadTickets(): Promise<void> {
    try {
      const tickets = await ticketService.fetchTickets();
      const oTicketModel = new JSONModel(tickets);
      this.getOwnerComponent().setModel(oTicketModel, "ticketModel");
    } catch (error) {
      Log.error(
        "Failed to fetch tickets",
        error,
        "tmui5.controller.BaseController"
      );
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTicket"));
    }
  }
}
