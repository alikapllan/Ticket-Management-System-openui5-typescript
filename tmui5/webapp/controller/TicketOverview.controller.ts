import BaseController from "./BaseController";
import AppComponent from "tmui5/Component";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Token from "sap/m/Token";
import ticketService from "tmui5/services/ticketService";
import FragmentUtil from "tmui5/util/FragmentUtil";
import formatter from "tmui5/model/formatter";
import Table from "sap/m/Table";
import MultiInput from "sap/m/MultiInput";
import Select from "sap/m/Select";
import DatePicker from "sap/m/DatePicker";
import Dialog from "sap/m/Dialog";
import Integer from "sap/ui/model/type/Integer";

export default class TicketOverviewController extends BaseController {
  formatter = formatter;

  public async onInit(): Promise<void> {
    BaseController.prototype.onInit.apply(this, arguments);
    const oRouter = (this.getOwnerComponent() as AppComponent).getRouter();
    oRouter
      .getRoute(this.Constants.ROUTES.TICKET_OVERVIEW)
      .attachPatternMatched(this._onRouteMatched, this);
  }

  private async _onRouteMatched(): Promise<void> {
    await this.loadTickets();
    this._removePreviousTicketSelections();
    this._clearSearchInputFields();
  }

  private _removePreviousTicketSelections(): void {
    (this.byId("ticketsTable") as Table).removeSelections(true);
  }

  private _clearSearchInputFields(): void {
    (this.byId("multiTicketIdInput") as MultiInput).removeAllTokens();
    (this.byId("ticketTypeOverviewInput") as Select).setSelectedKey("");
    (this.byId("ticketStatusOverviewInput") as Select).setSelectedKey("");
    (this.byId("idTicketCreatedOnDatePicker") as DatePicker).setValue("");
  }

  public async onGoFilterTicket(): Promise<void> {
    const aTicketIds = (this.byId("multiTicketIdInput") as MultiInput)
      .getTokens()
      .map((token) => token.getKey());
    const sSelectedTicketTypeId = (
      this.byId("ticketTypeOverviewInput") as Select
    ).getSelectedKey();
    const sSelectedTicketStatus = (
      this.byId("ticketStatusOverviewInput") as Select
    ).getSelectedKey();
    const sCreatedAt = (
      this.byId("idTicketCreatedOnDatePicker") as DatePicker
    ).getValue();

    if (
      aTicketIds.length === 0 &&
      !sSelectedTicketTypeId &&
      !sSelectedTicketStatus &&
      !sCreatedAt
    ) {
      MessageBox.information(
        this.oBundle.getText("MBoxProvideAtLeastOneFilter")
      );
      return;
    }

    const oFilters: Record<string, string> = {};
    if (aTicketIds.length > 0) oFilters.ticketIds = aTicketIds.join(",");
    if (sSelectedTicketTypeId) oFilters.ticketTypeId = sSelectedTicketTypeId;
    if (sSelectedTicketStatus) oFilters.ticketStatusId = sSelectedTicketStatus;
    if (sCreatedAt) oFilters.createdAt = sCreatedAt;

    const queryString = new URLSearchParams(oFilters).toString();

    try {
      const filteredTickets = await ticketService.fetchFilteredTickets(
        queryString
      );
      this.getOwnerComponent().setModel(
        new JSONModel(filteredTickets),
        "ticketModel"
      );
    } catch (error) {
      console.error(error);
      MessageBox.error(
        this.oBundle.getText("MBoxGETReqFailedOnFilteredTickets")
      );
    }
  }

  public onCreateTicket(): void {
    const oRouter = (this.getOwnerComponent() as AppComponent).getRouter();
    const oPreviousRoute = oRouter.getHashChanger().getHash();
    (this.getOwnerComponent() as AppComponent)
      .getModel("appState")
      .setProperty("/previousRoute", oPreviousRoute);
    this.navTo(this.Constants.ROUTES.CREATE_TICKET);
  }

  public async onEditTicket(): Promise<void> {
    const oTable = this.byId("ticketsTable") as Table;
    const aSelectedItems = oTable.getSelectedContexts();

    if (aSelectedItems.length !== 1) {
      MessageBox.error(
        this.oBundle.getText("MBoxErrorSelectOnlyOneTicketToEdit")
      );
      return;
    }

    const sTicketId = (aSelectedItems[0].getObject() as { ticketId: Integer })
      .ticketId;
    (this.getOwnerComponent() as AppComponent)
      .getRouter()
      .navTo(this.Constants.ROUTES.EDIT_TICKET, { ticketId: sTicketId });
  }

  public async onDeleteSelectedTickets(): Promise<void> {
    const oTable = this.byId("ticketsTable") as Table;
    const aSelectedTickets = oTable.getSelectedContexts();

    if (!aSelectedTickets.length) {
      MessageBox.error(this.oBundle.getText("MBoxSelectAtLeastOneTicket"));
      return;
    }

    MessageBox.confirm(this.oBundle.getText("MBoxConfirmToDeleteTicket"), {
      title: this.oBundle.getText("MBoxConfirmationTitleToDeleteTicket"),
      actions: [MessageBox.Action.YES, MessageBox.Action.NO],
      emphasizedAction: MessageBox.Action.YES,
      onClose: async (sAction: string) => {
        if (sAction === MessageBox.Action.YES) {
          for (const oSelectedTicket of aSelectedTickets) {
            const iTicketId = (
              oSelectedTicket.getObject() as { ticketId: Integer }
            ).ticketId;
            await ticketService.deleteTickets(iTicketId);
          }
          await this.loadTickets();
          MessageBox.success(
            this.oBundle.getText("MBoxSuccessOfDeletionTicket")
          );
        } else {
          oTable.removeSelections(true);
        }
      },
    });
  }

  public async onEditTicketNavigation(oEvent: any): Promise<void> {
    const oTable = this.byId("ticketsTable") as Table;
    const aSelectedItems = oTable.getSelectedContexts();

    if (aSelectedItems.length > 0) {
      MessageBox.warning(
        this.oBundle.getText("MBoxNavigationDisabledDueToSelection")
      );
      return;
    }

    const oSelectedItem = oEvent.getSource();
    const oBindingContext = oSelectedItem.getBindingContext("ticketModel");

    if (!oBindingContext) {
      MessageBox.error(this.oBundle.getText("MBoxTicketDetailsNotFoundToEdit"));
      return;
    }

    const sTicketId = oBindingContext.getProperty("ticketId");
    const oRouter = (this.getOwnerComponent() as AppComponent).getRouter();
    oRouter.navTo(this.Constants.ROUTES.EDIT_TICKET, { ticketId: sTicketId });
  }

  public async onTicketIdValueHelp(): Promise<void> {
    const oDialog = (await FragmentUtil.loadValueHelpFragment(
      this,
      this.Constants.FRAGMENTS.TICKET_ID_VALUEHELP,
      this.Constants.FRAGMENTS_ID.TICKET_ID_VALUEHELP
    )) as Dialog;
    oDialog.open();
  }

  public _onTicketIdValueHelpSearch(oEvent: any): void {
    const sValue = oEvent.getParameter("value");
    const oFilter = new Filter("title", FilterOperator.Contains, sValue);
    oEvent.getSource().getBinding("items").filter([oFilter]);
  }

  public _onTicketIdValueHelpClose(oEvent: any): void {
    const aSelectedItems = oEvent.getParameter("selectedItems");
    const oMultiInput = this.byId("multiTicketIdInput") as MultiInput;

    if (aSelectedItems && aSelectedItems.length > 0) {
      oMultiInput.removeAllTokens();
      aSelectedItems.forEach((oItem: any) => {
        oMultiInput.addToken(
          new Token({
            text: oItem.getTitle(),
            key: oItem.getBindingContext("ticketModel").getProperty("ticketId"),
          })
        );
      });
    }

    FragmentUtil.destroyFragment(
      this,
      this.Constants.FRAGMENTS_ID.TICKET_ID_VALUEHELP
    );
  }

  public onNavBack(): void {
    const sPreviousHash = History.getInstance().getPreviousHash();
    if (sPreviousHash !== undefined) window.history.go(-1);
    else this.navTo(this.Constants.ROUTES.MAIN);
  }
}
