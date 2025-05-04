import BaseController from "tmui5/controller/BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";
import Select from "sap/m/Select";
import AppComponent from "tmui5/Component";
import FileUploader from "sap/ui/unified/FileUploader";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import ticketService from "tmui5/services/ticketService";
import FragmentUtil from "tmui5/util/FragmentUtil";
import FileUploaderUtil from "tmui5/util/FileUploaderUtil";
import EmailUtil from "tmui5/util/EmailUtil";
import ValidationUtil from "tmui5/util/ValidationUtil";
import TextArea from "sap/m/TextArea";

export default class CreateTicket extends BaseController {
  public onInit(): void {
    super.onInit();
    const oCreateTicketFormModel = new JSONModel({
      teamMemberId: null,
      teamMemberEmail: null,
      teamMemberFullName: null,
      customerId: null,
      defaultTicketTypeId: null,
    });
    this.getView().setModel(oCreateTicketFormModel, "createTicketFormModel");

    (this.getOwnerComponent() as AppComponent)
      .getRouter()
      .getRoute(this.Constants.ROUTES.CREATE_TICKET)
      .attachPatternMatched(this._onRouteMatched, this);
  }

  private _onRouteMatched(): void {
    this._setTextAreaValueStateToNone();

    this._resetCreateTicketForm();
  }

  private _setTextAreaValueStateToNone(): void {
    (this.byId("descriptionInput") as TextArea).setValueState(
      this.ValueState.None
    );
  }

  public async onValueHelpRequestAssignedTo(): Promise<void> {
    try {
      await this.loadTeamMembers();
      const oDialog = (await FragmentUtil.loadValueHelpFragment(
        this,
        this.Constants.FRAGMENTS.ASSIGNED_TO_VALUEHELP,
        this.Constants.FRAGMENTS_ID.ASSIGNED_TO_VALUEHELP
      )) as Dialog;
      oDialog.open();
    } catch (error) {
      console.error(error);
      MessageBox.error(this.oBundle.getText("MBoxErrorLoadingAssignedTo"));
    }
  }

  public onValueHelpSearchAssignedTo(oEvent: any): void {
    const sValue = oEvent.getParameter("value");
    const oFilter = new Filter("fullName", FilterOperator.Contains, sValue);
    oEvent.getSource().getBinding("items").filter([oFilter]);
  }

  public onValueHelpCloseAssignedTo(oEvent: any): void {
    const oSelectedItem = oEvent.getParameter("selectedItem");
    if (!oSelectedItem) return;

    (this.byId("assignedToInputValueHelp") as Input).setValue(
      oSelectedItem.getTitle()
    );
    const oSelectedTeamMember = oSelectedItem
      .getBindingContext("teamMemberModel")
      .getObject();

    (this.byId("emailInput") as Input).setValue(oSelectedTeamMember.email);

    const oModel = this.getView().getModel(
      "createTicketFormModel"
    ) as JSONModel;
    oModel.setProperty("/teamMemberId", oSelectedTeamMember.teamMemberId);
    oModel.setProperty("/teamMemberEmail", oSelectedTeamMember.email);
    oModel.setProperty("/teamMemberFullName", oSelectedTeamMember.fullName);

    FragmentUtil.destroyFragment(
      this,
      this.Constants.FRAGMENTS_ID.ASSIGNED_TO_VALUEHELP
    );
  }

  public async onValueHelpRequestCustomer(): Promise<void> {
    try {
      await this.loadCustomers();
      const oDialog = (await FragmentUtil.loadValueHelpFragment(
        this,
        this.Constants.FRAGMENTS.CUSTOMER_VALUEHELP,
        this.Constants.FRAGMENTS_ID.CUSTOMER_VALUEHELP
      )) as Dialog;
      oDialog.open();
    } catch (error) {
      console.error(error);
      MessageBox.error(this.oBundle.getText("MBoxErrorLoadingCustomer"));
    }
  }

  public onValueHelpSearchCustomer(oEvent: any): void {
    const sValue = oEvent.getParameter("value");
    const oFilter = new Filter("name", FilterOperator.Contains, sValue);
    oEvent.getSource().getBinding("items").filter([oFilter]);
  }

  public onValueHelpCloseCustomer(oEvent: any): void {
    const oSelectedItem = oEvent.getParameter("selectedItem");
    if (!oSelectedItem) return;

    (this.byId("customerInputValueHelp") as Input).setValue(
      oSelectedItem.getTitle()
    );

    const oCustomer = oSelectedItem
      .getBindingContext("customerModel")
      .getObject();

    const oModel = this.getView().getModel(
      "createTicketFormModel"
    ) as JSONModel;
    oModel.setProperty("/customerId", oCustomer.customerId);

    FragmentUtil.destroyFragment(
      this,
      this.Constants.FRAGMENTS_ID.CUSTOMER_VALUEHELP
    );
  }

  public async onCreateTicket(): Promise<void> {
    BusyIndicator.show();
    await this._executeTicketCreateWorkflow();
  }

  private async _executeTicketCreateWorkflow(): Promise<void> {
    await this._createTicketWithFilesAndNotification();
  }

  private async _createTicketWithFilesAndNotification(): Promise<void> {
    const sTicketTypeId = (
      this.byId("ticketTypeInput") as Select
    ).getSelectedKey();
    const oModel = this.getView().getModel("createTicketFormModel");
    const sTeamMemberId = oModel.getProperty("/teamMemberId");
    const sCustomerId = oModel.getProperty("/customerId");
    const sTitle = (this.byId("titleInput") as Input).getValue();
    const sDescription = (this.byId("descriptionInput") as Input).getValue();

    if (
      !sTicketTypeId ||
      !sTeamMemberId ||
      !sCustomerId ||
      !sTitle ||
      !sDescription
    ) {
      BusyIndicator.hide();
      MessageBox.error(this.oBundle.getText("MBoxFillAllFields"));
      return;
    }

    const oPayload = {
      ticketTypeId: parseInt(sTicketTypeId),
      teamMemberId: parseInt(sTeamMemberId),
      customerId: parseInt(sCustomerId),
      title: sTitle,
      description: sDescription,
    };

    try {
      const createdTicketResponse = await ticketService.createTickets(oPayload);
      const ticketId = createdTicketResponse.ticketId;

      await FileUploaderUtil.uploadFiles(
        ticketId,
        this.byId("fileUploaderCreateTicket") as FileUploader
      );

      const emailPayload = {
        ticketId,
        teamMemberEmail: oModel.getProperty("/teamMemberEmail"),
        teamMemberFullName: oModel.getProperty("/teamMemberFullName"),
        title: sTitle,
        description: sDescription,
      };

      await EmailUtil.sendEmail(
        this.Constants.EMAIL_SENDING_TYPE.CREATED,
        emailPayload
      );

      BusyIndicator.hide();
      MessageBox.success(
        this.oBundle.getText("MBoxTicketCreatedSuccessfully"),
        {
          onClose: () => this._resetCreateTicketForm(),
        }
      );
    } catch (error) {
      BusyIndicator.hide();
      console.error(error);
      MessageBox.error(this.oBundle.getText("MBoxFailedToCreateTicket"));
    }
  }

  public onFileUploaderFilenameLengthExceed(): void {
    FileUploaderUtil.handleFilenameLengthExceed(this.oBundle);
  }

  public onFileUploaderTypeMissmatch(oEvent: any): void {
    FileUploaderUtil.handleTypeMissmatch(oEvent, this.oBundle);
  }

  public onCancelTicket(): void {
    const oAppState = this.getOwnerComponent().getModel("appState");
    const sPreviousRoute = oAppState.getProperty("/previousRoute");

    if (sPreviousRoute === "TicketOverview") {
      (this.getOwnerComponent() as AppComponent).initializeAppStateModel();
      this.navTo(this.Constants.ROUTES.TICKET_OVERVIEW);
    } else {
      this.navTo(this.Constants.ROUTES.MAIN);
    }
  }

  private _resetCreateTicketForm(): void {
    (this.byId("assignedToInputValueHelp") as Input).setValue("");
    (this.byId("emailInput") as Input).setValue("");
    (this.byId("customerInputValueHelp") as Input).setValue("");
    (this.byId("titleInput") as Input).setValue("");
    (this.byId("descriptionInput") as Input).setValue("");
    (this.byId("fileUploaderCreateTicket") as FileUploader).setValue("");

    const oModel = this.getView().getModel(
      "createTicketFormModel"
    ) as JSONModel;
    oModel.setProperty("/teamMemberId", null);
    oModel.setProperty("/teamMemberEmail", null);
    oModel.setProperty("/teamMemberFullName", null);
    oModel.setProperty("/customerId", null);
    oModel.setProperty(
      "/defaultTicketTypeId",
      this.getView().getModel("ticketTypeModel")?.getProperty("/0/ticketTypeId")
    );

    // TextArea live change - reset value state
    const oTextArea = this.byId("descriptionInput") as TextArea;
    oTextArea.setValue("");
    oTextArea.setValueState(this.ValueState.None);
  }

  public onDescriptionLiveChange(oEvent: any): void {
    ValidationUtil.validateTextAreaLength(oEvent, this);
  }

  public onNavBack(): void {
    const oAppState = this.getOwnerComponent().getModel("appState");
    const sPreviousRoute = oAppState.getProperty("/previousRoute");

    if (sPreviousRoute === "TicketOverview") {
      (this.getOwnerComponent() as AppComponent).initializeAppStateModel();
      this.navTo(this.Constants.ROUTES.TICKET_OVERVIEW);
    } else {
      this.navTo(this.Constants.ROUTES.MAIN);
    }
  }
}
