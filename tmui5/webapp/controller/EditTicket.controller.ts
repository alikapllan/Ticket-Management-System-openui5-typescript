import BaseController from "./BaseController";
import AppComponent from "tmui5/Component";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import Control from "sap/ui/core/Control";
import Dialog from "sap/m/Dialog";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import FileUploader, {
  FileUploader$TypeMissmatchEvent,
} from "sap/ui/unified/FileUploader";
import UploadSet from "sap/m/upload/UploadSet";
import UploadSetItem from "sap/m/upload/UploadSetItem";
import Input from "sap/m/Input";
import ticketService from "tmui5/services/ticketService";
import ticketCommentService from "tmui5/services/ticketCommentService";
import formatter from "tmui5/model/formatter";
import FragmentUtil from "tmui5/util/FragmentUtil";
import FileUploaderUtil from "tmui5/util/FileUploaderUtil";
import EmailUtil from "tmui5/util/EmailUtil";
import ValidationUtil from "tmui5/util/ValidationUtil";
import TextArea, { TextArea$LiveChangeEvent } from "sap/m/TextArea";
import {
  SelectDialog$SearchEvent,
  SelectDialog$ConfirmEvent,
} from "sap/m/SelectDialog";
import StandardListItem from "sap/m/StandardListItem";
import ListBinding from "sap/ui/model/ListBinding";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Log from "sap/base/Log";

export default class EditTicketController extends BaseController {
  formatter = formatter;

  async onInit(): Promise<void> {
    super.onInit();
    const oEditTicketFormModel = new JSONModel({
      teamMemberId: null,
      teamMemberEmail: null,
      teamMemberFullName: null,
      customerId: null,
    });
    this.getView().setModel(oEditTicketFormModel, "editTicketFormModel");
    (this.getOwnerComponent() as AppComponent)
      .getRouter()
      .getRoute("RouteEditTicket")
      .attachPatternMatched(this._onRouteMatched.bind(this));
  }

  private async _onRouteMatched(oEvent: Route$PatternMatchedEvent): Promise<void> {
    this._setTextAreaValueStateToNone();

    const sTicketId = (
      oEvent.getParameter("arguments") as { ticketId: string }
    ).ticketId;
    const iTicketId = parseInt(sTicketId);

    this._resetEditTicketForm();

    // check navigated ticket really exists, if not land to NotFound Page
    const aTicketExistenceCheck = await this._checkTicketExistence(iTicketId);

    if (!aTicketExistenceCheck || aTicketExistenceCheck.length === 0) {
      // no such ticket
      this._displayNotFoundPage();
      return;
    }

    await this._loadAndBindTicketDetailToEdit(iTicketId);
    // Load comments & files in parallel
    await Promise.all([
      this._loadTicketComments(iTicketId),
      this._loadUploadedTicketFilesAndBindToView(iTicketId),
    ]);
  }

  private _setTextAreaValueStateToNone(): void {
    (this.byId("descriptionEditInput") as TextArea).setValueState(
      this.ValueState.None
    );
  }

  private _resetEditTicketForm(): void {
    (this.byId("fileUploaderEditTicket") as FileUploader).setValue("");
    (this.byId("uploadedFilesSetEditTicket") as UploadSet).destroyItems();
    (this.byId("updateCommentEditInput") as Input).setValue("");
  }

  private async _checkTicketExistence(iTicketId: number): Promise<any> {
    return await ticketService.fetchTicket(iTicketId);
  }

  private async _displayNotFoundPage(): Promise<void> {
    (this.getOwnerComponent() as AppComponent)
      .getRouter()
      .getTargets()
      .display("TargetNotFound");
  }

  private async _loadAndBindTicketDetailToEdit(
    iTicketId: number
  ): Promise<void> {
    try {
      const ticketToEdit = await ticketService.fetchTicket(iTicketId);
      const oEditTicketModel = new JSONModel(ticketToEdit[0]);
      this.getView().setModel(oEditTicketModel, "editTicketModel");
      const oEditTicketFormModel = this.getView().getModel(
        "editTicketFormModel"
      ) as JSONModel;
      oEditTicketFormModel.setProperty(
        "/teamMemberId",
        oEditTicketModel.getData().teamMemberId
      );
      oEditTicketFormModel.setProperty(
        "/teamMemberEmail",
        oEditTicketModel.getData().teamMemberEmail
      );
      oEditTicketFormModel.setProperty(
        "/teamMemberFullName",
        oEditTicketModel.getData().teamMemberFullName
      );
      oEditTicketFormModel.setProperty(
        "/customerId",
        oEditTicketModel.getData().customerId
      );
    } catch (error) {
      Log.error(
        "Failed to load ticket details",
        error,
        "tmui5.controller.EditTicket"
      );
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTicketToEdit"));
    }
  }

  private async _loadTicketComments(iTicketId: number): Promise<void> {
    try {
      const ticketComments = await ticketCommentService.fetchTicketComments(
        iTicketId
      );
      const oTicketCommentModel = new JSONModel(ticketComments);
      this.getView().setModel(oTicketCommentModel, "ticketCommentModel");
    } catch (error) {
      Log.error(
        "Failed to load ticket comments",
        error,
        "tmui5.controller.EditTicket"
      );
      MessageBox.error(this.oBundle.getText("MBoxGETReqFailedOnTicketComment"));
    }
  }

  private async _loadUploadedTicketFilesAndBindToView(
    iTicketId: number
  ): Promise<void> {
    (this.byId("uploadedFilesLabelEditTicket") as Control).setVisible(false);
    (this.byId("uploadedFilesSetEditTicket") as Control).setVisible(false);
    const oFilesModel = await FileUploaderUtil.loadTicketFiles(
      iTicketId,
      this.oBundle
    );
    if (oFilesModel && oFilesModel.getData().length > 0) {
      this.getView().setModel(oFilesModel, "editTicketUploadedFilesModel");
      (this.byId("uploadedFilesLabelEditTicket") as Control).setVisible(true);
      (this.byId("uploadedFilesSetEditTicket") as Control).setVisible(true);
    }
  }

  public onDownloadSelectedButton(): void {
    const oUploadSet = this.byId("uploadedFilesSetEditTicket") as UploadSet;
    const aSelectedItems = oUploadSet.getSelectedItems();
    if (!aSelectedItems.length) {
      MessageBox.warning(
        this.oBundle.getText("MBoxSelectAtLeastOneFileToDownload")
      );
      return;
    }
    aSelectedItems.forEach((oItem: UploadSetItem) => {
      const sFileName = oItem.getFileName();
      const sUrl = oItem
        .getBindingContext("editTicketUploadedFilesModel")
        .getProperty("file");
      const oLink = document.createElement("a");
      oLink.href = `data:application/octet-stream;base64,${sUrl}`;
      oLink.download = sFileName;
      document.body.appendChild(oLink);
      oLink.click();
      document.body.removeChild(oLink);
    });
    oUploadSet.invalidate();
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
      Log.error(
        "Failed to load team members",
        error,
        "tmui5.controller.EditTicket"
      );
      MessageBox.error(this.oBundle.getText("MBoxErrorLoadingAssignedTo"));
    }
  }

  public onValueHelpSearchAssignedTo(oEvent: SelectDialog$SearchEvent): void {
    const sValue = oEvent.getParameter("value");
    (oEvent.getSource().getBinding("items") as ListBinding).filter([
      new Filter("fullName", FilterOperator.Contains, sValue),
    ]);
  }

  public onValueHelpCloseAssignedTo(oEvent: SelectDialog$ConfirmEvent): void {
    const oSelectedItem = oEvent.getParameter("selectedItem") as StandardListItem;
    if (!oSelectedItem) return;

    (this.byId("assignedToEditValueHelpInput") as Input).setValue(
      oSelectedItem.getTitle()
    );

    const oSelectedTeamMember = oSelectedItem
      .getBindingContext("teamMemberModel")
      .getObject() as Record<string, string>;

    (this.byId("assignedToEditEmailInput") as Input).setValue(
      oSelectedTeamMember.email
    );

    const oModel = this.getView().getModel("editTicketFormModel") as JSONModel;
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
      Log.error(
        "Failed to load customers or fragment issue :P",
        error,
        "tmui5.controller.EditTicket"
      );
      MessageBox.error(this.oBundle.getText("MBoxErrorLoadingCustomer"));
    }
  }

  public onValueHelpSearchCustomer(oEvent: SelectDialog$SearchEvent): void {
    const sValue = oEvent.getParameter("value");
    (oEvent.getSource().getBinding("items") as ListBinding).filter([
      new Filter("name", FilterOperator.Contains, sValue),
    ]);
  }

  public onValueHelpCloseCustomer(oEvent: SelectDialog$ConfirmEvent): void {
    const oSelectedItem = oEvent.getParameter("selectedItem") as StandardListItem;
    if (!oSelectedItem) return;

    (this.byId("customerEditValueHelpInput") as Input).setValue(
      oSelectedItem.getTitle()
    );

    const oCustomer = oSelectedItem
      .getBindingContext("customerModel")
      .getObject() as Record<string, string>;
    const oModel = this.getView().getModel("editTicketFormModel") as JSONModel;
    oModel.setProperty("/customerId", oCustomer.customerId);

    FragmentUtil.destroyFragment(
      this,
      this.Constants.FRAGMENTS_ID.CUSTOMER_VALUEHELP
    );
  }

  public onFileUploaderFilenameLengthExceed(): void {
    FileUploaderUtil.handleFilenameLengthExceed(this.oBundle);
  }

  public onFileUploaderTypeMissmatch(
    oEvent: FileUploader$TypeMissmatchEvent
  ): void {
    FileUploaderUtil.handleTypeMissmatch(oEvent, this.oBundle);
  }

  public async onSaveTicket(): Promise<void> {
    BusyIndicator.show();
    await this._executeTicketUpdateWorkflow();
  }

  private async _executeTicketUpdateWorkflow(): Promise<void> {
    await this._createTicketCommentPOST();
    await this._updateTicketWithFilesAndNotification();
  }

  private async _updateTicketWithFilesAndNotification(): Promise<void> {
    const sTicketId = (this.byId("ticketNumberEditInput") as Input).getValue();
    const sTicketTypeId = (
      this.byId("ticketTypeEditInput") as Input
    ).getSelectedKey();
    const oEditTicketFormModel = <JSONModel>(
      this.getView().getModel("editTicketFormModel")
    );
    const sTeamMemberId = oEditTicketFormModel.getProperty("/teamMemberId");
    const sCustomerId = oEditTicketFormModel.getProperty("/customerId");
    const sTicketStatusId = (
      this.byId("ticketStatusEditInput") as Input
    ).getSelectedKey();
    const sTitle = (this.byId("titleEditInput") as Input).getValue();
    const sDescription = (
      this.byId("descriptionEditInput") as Input
    ).getValue();

    if (
      !sTicketId ||
      !sTicketTypeId ||
      !sTeamMemberId ||
      !sCustomerId ||
      !sTicketStatusId ||
      !sTitle ||
      !sDescription
    ) {
      BusyIndicator.hide();
      MessageBox.error(this.oBundle.getText("MBoxFillAllFieldsEdit"));
      return;
    }

    const oPayload = {
      ticketTypeId: parseInt(sTicketTypeId),
      teamMemberId: parseInt(sTeamMemberId),
      customerId: parseInt(sCustomerId),
      ticketStatusId: parseInt(sTicketStatusId),
      title: sTitle,
      description: sDescription,
    };

    try {
      const updatedTicketResponse = await ticketService.updateTickets(
        parseInt(sTicketId),
        oPayload
      );
      const ticketId = updatedTicketResponse.ticketId;
      const oFileUploader = this.byId("fileUploaderEditTicket") as FileUploader;
      await FileUploaderUtil.uploadFiles(ticketId, oFileUploader);
      const emailPayload = {
        ticketId,
        teamMemberEmail: oEditTicketFormModel.getProperty("/teamMemberEmail"),
        teamMemberFullName: oEditTicketFormModel.getProperty(
          "/teamMemberFullName"
        ),
        title: sTitle,
        description: sDescription,
      };
      await EmailUtil.sendEmail(
        this.Constants.EMAIL_SENDING_TYPE.UPDATED,
        emailPayload
      );
      MessageToast.show(this.oBundle.getText("MToastTicketEditedSuccessfully"));
      BusyIndicator.hide();
      setTimeout(() => this.navTo(this.Constants.ROUTES.TICKET_OVERVIEW), 1000);
    } catch (error) {
      BusyIndicator.hide();
      Log.error(
        "Failed to update ticket. Email also might not be sent :P too lazy to implement an additional catch for it :P",
        error,
        "tmui5.controller.EditTicket"
      );
      MessageBox.error(this.oBundle.getText("MBoxFailedToEditTicket"));
    }
  }

  private async _createTicketCommentPOST(): Promise<void> {
    const sTicketId = (this.byId("ticketNumberEditInput") as Input).getValue();
    const sTicketComment = (
      this.byId("updateCommentEditInput") as Input
    ).getValue();
    if (!sTicketId || !sTicketComment) return;
    const oPayload = { ticketId: parseInt(sTicketId), comment: sTicketComment };
    try {
      await ticketCommentService.createTicketComment(oPayload);
    } catch (error) {
      BusyIndicator.hide();
      Log.error(
        "Failed to create a new ticket comment",
        error,
        "tmui5.controller.EditTicket"
      );
      MessageBox.error(this.oBundle.getText("MBoxFailedToCreateTicketComment"));
    }
  }

  public onCancelTicket(): void {
    this.navTo(this.Constants.ROUTES.TICKET_OVERVIEW);
  }

  public onDescriptionLiveChange(oEvent: TextArea$LiveChangeEvent): void {
    ValidationUtil.validateTextAreaLength(oEvent, this);
  }

  public onNavBack(): void {
    const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();
    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      this.navTo(this.Constants.ROUTES.TICKET_OVERVIEW);
    }
  }
}
