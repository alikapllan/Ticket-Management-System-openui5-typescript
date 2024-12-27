sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "tmui5/services/ticketService",
    "tmui5/services/ticketCommentService",
    "tmui5/services/ticketEmailService",
    "tmui5/constants/Constants",
    "tmui5/util/FragmentUtil",
    "tmui5/model/formatter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    History,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox,
    ticketService,
    ticketCommentService,
    ticketEmailService,
    Constants,
    FragmentUtil,
    formatter
  ) {
    "use strict";

    return BaseController.extend("tmui5.controller.EditTicket", {
      formatter: formatter,
      onInit: async function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);
        // onInit lifecycle method in the child controller overrides the onInit of the parent (BaseController)

        // Form Model to hold data to for cache purpose and email operation
        const oEditTicketFormData = {
          teamMemberId: null,
          teamMemberEmail: null,
          teamMemberFullName: null,
          customerId: null,
        };
        const oEditTicketFormModel = new JSONModel(oEditTicketFormData);
        this.getView().setModel(oEditTicketFormModel, "editTicketFormModel");

        // Attach handler for when the EditTicket is matched
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteEditTicket")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: async function (oEvent) {
        const oArgs = oEvent.getParameter("arguments");
        const sTicketId = oArgs.ticketId;
        const iTicketId = parseInt(sTicketId);

        await this.loadTicketStatuses();
        await this._loadAndBindTicketDetailToEdit(iTicketId);
        await this._loadTicketComments(iTicketId);
      },

      _loadAndBindTicketDetailToEdit: async function (iTicketId) {
        try {
          // Fetch ticket details from backend throug service
          const ticketToEdit = await ticketService.fetchTicket(iTicketId);
          // ticketToEdit is returned as a array with a single ticket object so [0] is taken
          const oEditTicketModel = new JSONModel(ticketToEdit[0]);
          // Bind the selected ticket data to the view
          this.getView().setModel(oEditTicketModel, "editTicketModel");

          // Update the 'editTicketFormModel' with values from the fetched ticket
          // It is overridden when updated
          const oEditTicketFormModel = this.getView().getModel(
            "editTicketFormModel"
          );

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
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxGETReqFailedOnTicketToEdit")
          );
        }
      },

      _loadTicketComments: async function (iTicketId) {
        try {
          const ticketComments = await ticketCommentService.fetchTicketComments(
            iTicketId
          );

          const oTicketCommentModel = new JSONModel(ticketComments);

          this.getOwnerComponent().setModel(
            oTicketCommentModel,
            "ticketCommentModel"
          );
        } catch (error) {
          console.error(error);
          this.oBundle.getText("MBoxGETReqFailedOnTicketComment");
        }
      },

      // Value Help 'Assigned To' - START
      onValueHelpRequestAssignedTo: async function (oEvent) {
        try {
          // Read Team members through api
          await this.loadTeamMembers();

          // Load Fragment
          const oDialog = await FragmentUtil.loadValueHelpFragment(
            this,
            Constants.FRAGMENTS.ASSIGNED_TO_VALUEHELP,
            Constants.FRAGMENTS_ID.ASSIGNED_TO_VALUEHELP
          );

          oDialog.open();
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxErrorLoadingAssignedTo"));
        }
      },

      onValueHelpSearchAssignedTo: function (oEvent) {
        const sValue = oEvent.getParameter("value");
        const oFilter = new Filter("fullName", FilterOperator.Contains, sValue);

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onValueHelpCloseAssignedTo: function (oEvent) {
        const oSelectedItem = oEvent.getParameter("selectedItem");

        if (!oSelectedItem) {
          return;
        }

        // Set the team member full name to assigned to value help input area
        this.byId("assignedToEditValueHelpInput").setValue(
          oSelectedItem.getTitle()
        );

        // Retrieve the full obj. for the selected team member to get email
        const oSelectedTeamMember = oSelectedItem
          .getBindingContext("teamMemberModel")
          .getObject();
        // Set the email to the input field of Email
        this.byId("assignedToEditEmailInput").setValue(
          oSelectedTeamMember.email
        );

        // Store the teamMemberId & teamMemberFullName & teamMemberMail in model -> editTicketFormModel
        const oEditTicketFormModel = this.getView().getModel(
          "editTicketFormModel"
        );
        // in case a new team member is selected, override oEditTicketFormModel
        oEditTicketFormModel.setProperty(
          "/teamMemberId",
          oSelectedTeamMember.teamMemberId
        );

        oEditTicketFormModel.setProperty(
          "/teamMemberEmail",
          oSelectedTeamMember.email
        );

        oEditTicketFormModel.setProperty(
          "/teamMemberFullName",
          oSelectedTeamMember.fullName
        );

        // Destroy fragment
        FragmentUtil.destroyFragment(
          this,
          Constants.FRAGMENTS_ID.ASSIGNED_TO_VALUEHELP
        );
      },
      // Value Help 'Assigned To' - END

      // Value Help 'Customer' - START
      onValueHelpRequestCustomer: async function (oEvent) {
        try {
          // Read Customers through api
          await this.loadCustomers();

          // Load fragment
          const oDialog = await FragmentUtil.loadValueHelpFragment(
            this,
            Constants.FRAGMENTS.CUSTOMER_VALUEHELP,
            Constants.FRAGMENTS_ID.CUSTOMER_VALUEHELP
          );
          oDialog.open();
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxErrorLoadingCustomer"));
        }
      },

      onValueHelpSearchCustomer: function (oEvent) {
        const sValue = oEvent.getParameter("value");
        const oFilter = new Filter("name", FilterOperator.Contains, sValue);

        oEvent.getSource().getBinding("items").filter([oFilter]);
      },

      onValueHelpCloseCustomer: function (oEvent) {
        const oSelectedItem = oEvent.getParameter("selectedItem");

        if (!oSelectedItem) {
          return;
        }

        const oCustomer = oSelectedItem
          .getBindingContext("customerModel")
          .getObject();

        // Set the customer name to input field of Customer
        this.byId("customerEditValueHelpInput").setValue(
          oSelectedItem.getTitle()
        );

        // Store the customerId in model -> editTicketFormModel
        this.getView()
          .getModel("editTicketFormModel")
          .setProperty("/customerId", oCustomer.customerId);

        // Destroy fragment
        FragmentUtil.destroyFragment(
          this,
          Constants.FRAGMENTS_ID.CUSTOMER_VALUEHELP
        );
      },
      // Value Help 'Customer' - END

      onSaveTicket: async function () {
        // If any Update Comment provided -> POST Request in order to add to TicketComment table
        await this._createTicketCommentPOST();

        // PUT Request to Update Ticket
        await this._updateCustomerPUTandSendUpdateEmail();
      },

      onCancelTicket: function () {
        this.navTo("RouteTicketOverview");
      },

      _createTicketCommentPOST: async function () {
        // Retrieve values of related input fields
        const sTicketId = this.byId("ticketNumberEditInput").getValue();
        const sTicketComment = this.byId("updateCommentEditInput").getValue();

        // Validate input fields
        if (!sTicketId || !sTicketComment) {
          return;
        }

        // Prepare Payload to pass
        const oPayload = {
          ticketId: parseInt(sTicketId),
          comment: sTicketComment,
        };

        // Clear update comment field
        this.byId("updateCommentEditInput").setValue("");

        // Send POST request
        try {
          await ticketCommentService.createTicketComment(oPayload);
        } catch (error) {
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxFailedToCreateTicketComment")
          );
        }
      },

      _updateCustomerPUTandSendUpdateEmail: async function () {
        // Retrieve values of Input fields
        const sTicketId = this.byId("ticketNumberEditInput").getValue();
        const sTicketTypeId = this.byId("ticketTypeEditInput").getSelectedKey();
        const oEditTicketFormModel = this.getView().getModel(
          "editTicketFormModel"
        );
        const sTeamMemberId = oEditTicketFormModel.getProperty("/teamMemberId");
        const sCustomerId = oEditTicketFormModel.getProperty("/customerId");
        const sTicketStatusId = this.byId(
          "ticketStatusEditInput"
        ).getSelectedKey();
        const sTitle = this.byId("titleEditInput").getValue();
        const sDescription = this.byId("descriptionEditInput").getValue();

        // Validate inputs
        if (
          !sTicketId ||
          !sTicketTypeId ||
          !sTeamMemberId ||
          !sCustomerId ||
          !sTicketStatusId ||
          !sTitle ||
          !sDescription
        ) {
          MessageBox.error(this.oBundle.getText("MBoxFillAllFieldsEdit"));
          return false;
        }

        // Prepare payload to pass to PUT
        const oPayload = {
          ticketTypeId: parseInt(sTicketTypeId),
          teamMemberId: parseInt(sTeamMemberId),
          customerId: parseInt(sCustomerId),
          ticketStatusId: parseInt(sTicketStatusId),
          title: sTitle,
          description: sDescription,
        };

        // Send PUT request
        try {
          const updatedTicketResponse = await ticketService.updateTickets(
            parseInt(sTicketId),
            oPayload
          );

          // Extract related fields and SEND ticket update email
          const ticketId = updatedTicketResponse.ticketId;
          const teamMemberEmail =
            oEditTicketFormModel.getProperty("/teamMemberEmail");
          const teamMemberFullName = oEditTicketFormModel.getProperty(
            "/teamMemberFullName"
          );

          try {
            await ticketEmailService.sendTicketUpdatedEmail({
              ticketId,
              teamMemberEmail,
              teamMemberFullName,
              title: sTitle,
              description: sDescription,
            });
          } catch (emailError) {
            console.error("Failed to send ticket update email:", emailError);
          }

          // Success
          MessageToast.show(
            this.oBundle.getText("MToastTicketEditedSuccessfully")
          );
          // wait 1 sec & Navigate back to the Ticket Overview Page
          setTimeout(
            async function () {
              this.navTo("RouteTicketOverview");
            }.bind(this), // setTimeout callback refers to the controller instance
            1000
          );
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxFailedToCreateTicket"));
        }
      },

      onNavBack: function () {
        const oHistory = History.getInstance();
        const sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.navTo("RouteTicketOverview");
        }
      },
    });
  }
);
