sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "tmui5/services/ticketService",
    "tmui5/services/ticketEmailService",
    "tmui5/constants/Constants",
    "tmui5/util/FragmentUtil",
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
    MessageBox,
    ticketService,
    ticketEmailService,
    Constants,
    FragmentUtil
  ) {
    "use strict";

    return BaseController.extend("tmui5.controller.CreateTicket", {
      onInit: function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);

        // Form Model to hold data to for cache purpose and email operation
        const oCreateTicketFormData = {
          teamMemberId: null,
          teamMemberEmail: null,
          teamMemberFullName: null,
          customerId: null,
          defaultTicketTypeId: null,
        };
        const oCreateTicketFormModel = new JSONModel(oCreateTicketFormData);
        this.getView().setModel(
          oCreateTicketFormModel,
          "createTicketFormModel"
        );

        // Attach route-matched event
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteCreateTicket")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      // Value Help 'Assigned To' - START
      onValueHelpRequestAssignedTo: async function (oEvent) {
        try {
          // Read Team members through api
          await this.loadTeamMembers();

          // Load fragment
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

        // Set the assigne to input field of Assignee
        this.byId("assignedToInputValueHelp").setValue(
          oSelectedItem.getTitle()
        );

        // Retrieve the full obj. for the selected team member to get email
        const oSelectedTeamMember = oSelectedItem
          .getBindingContext("teamMemberModel")
          .getObject(); // actual data in JSON
        // Set the email to the input field of Email
        this.byId("emailInput").setValue(oSelectedTeamMember.email);

        // Store the teamMemberId & teamMemberMail & teamMemberFullName in model -> createTicketFormModel
        this.getView()
          .getModel("createTicketFormModel")
          .setProperty("/teamMemberId", oSelectedTeamMember.teamMemberId);

        this.getView()
          .getModel("createTicketFormModel")
          .setProperty("/teamMemberEmail", oSelectedTeamMember.email);

        this.getView()
          .getModel("createTicketFormModel")
          .setProperty("/teamMemberFullName", oSelectedTeamMember.fullName);

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
        this.byId("customerInputValueHelp").setValue(oSelectedItem.getTitle());

        // Store the customerId in model -> createTicketFormModel
        this.getView()
          .getModel("createTicketFormModel")
          .setProperty("/customerId", oCustomer.customerId);

        // Destroy fragment
        FragmentUtil.destroyFragment(
          this,
          Constants.FRAGMENTS_ID.CUSTOMER_VALUEHELP
        );
      },
      // Value Help 'Customer' - END

      onCreateTicket: async function () {
        this._createTicketPOSTandSendCreationEmail();
      },

      _createTicketPOSTandSendCreationEmail: async function () {
        // retrieve values of Input fields
        const sTicketTypeId = this.byId("ticketTypeInput").getSelectedKey();
        const oCreateTicketFormModel = this.getView().getModel(
          "createTicketFormModel"
        );
        const sTeamMemberId =
          oCreateTicketFormModel.getProperty("/teamMemberId");
        const sCustomerId = oCreateTicketFormModel.getProperty("/customerId");
        const sTitle = this.byId("titleInput").getValue();
        const sDescription = this.byId("descriptionInput").getValue();

        // Validate inputs
        if (
          !sTicketTypeId ||
          !sTeamMemberId ||
          !sCustomerId ||
          !sTitle ||
          !sDescription
        ) {
          MessageBox.error(this.oBundle.getText("MBoxFillAllFields"));
          return;
        }

        // Prepare payload to pass to POST
        const oPayload = {
          ticketTypeId: parseInt(sTicketTypeId),
          teamMemberId: parseInt(sTeamMemberId),
          customerId: parseInt(sCustomerId),
          title: sTitle,
          description: sDescription,
        };

        // Send POST request
        try {
          const createdTicketResponse = await ticketService.createTickets(
            oPayload
          );

          // Extract ticketId & other related fields and SEND ticket creation email
          const ticketId = createdTicketResponse.ticketId;
          const teamMemberEmail =
            oCreateTicketFormModel.getProperty("/teamMemberEmail");
          const teamMemberFullName = oCreateTicketFormModel.getProperty(
            "/teamMemberFullName"
          );

          try {
            await ticketEmailService.sendTicketCreatedEmail({
              ticketId,
              teamMemberEmail,
              teamMemberFullName,
              title: sTitle,
              description: sDescription,
            });
          } catch (emailError) {
            console.error("Failed to send ticket creation email:", emailError);
          }

          // Success
          MessageBox.success(
            this.oBundle.getText("MBoxTicketCreatedSuccessfully"),
            {
              onClose: function () {
                // clear input fields and reset CreateTicketFormModel model
                this._resetCreateTicketForm();
              }.bind(this),
            }
          );
        } catch (error) {
          console.error(error);
          MessageBox.error(this.oBundle.getText("MBoxFailedToCreateTicket"));
        }
      },

      onCancelTicket: function () {
        this.navTo("RouteMainView");
      },

      _onRouteMatched: function () {
        this._resetCreateTicketForm(); // Reset form whenever the route is matched
      },

      _resetCreateTicketForm: function () {
        // Clear value help fields
        this.byId("assignedToInputValueHelp").setValue("");
        this.byId("emailInput").setValue("");
        this.byId("customerInputValueHelp").setValue("");

        // Clear simple input fields
        this.byId("titleInput").setValue("");
        this.byId("descriptionInput").setValue("");

        // Reset CreateTicketFormModel (teamMemberId, customerId, pick first TicketTypeId as default)
        const oCreateTicketFormModel = this.getView().getModel(
          "createTicketFormModel"
        );
        oCreateTicketFormModel.setProperty("/teamMemberId", null);
        oCreateTicketFormModel.setProperty("/customerId", null);
        oCreateTicketFormModel.setProperty(
          "/defaultTicketTypeId",
          this.getView()
            .getModel("ticketTypeModel")
            ?.getProperty("/0/ticketTypeId") // Dynamically pick the first ticket type
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
