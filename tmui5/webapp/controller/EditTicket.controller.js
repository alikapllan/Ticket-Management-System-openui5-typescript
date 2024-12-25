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
    MessageToast,
    MessageBox,
    ticketService,
    Constants,
    FragmentUtil
  ) {
    "use strict";

    return BaseController.extend("tmui5.controller.EditTicket", {
      onInit: async function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);
        // onInit lifecycle method in the child controller overrides the onInit of the parent (BaseController)

        // Form Model to hold teamMemberId, customerId
        const oEditTicketFormData = {
          teamMemberId: null,
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

        await this.loadTicketStatuses();

        try {
          // Fetch ticket details from backend throug service
          const ticketToEdit = await ticketService.fetchTicket(
            parseInt(sTicketId)
          );
          // ticketToEdit is returned as a array with a single ticket object so [0] is taken
          const oEditTicketModel = new JSONModel(ticketToEdit[0]);
          // Bind the selected ticket data to the view
          this.getView().setModel(oEditTicketModel, "editTicketModel");

          // Update the 'editTicketFormModel' with values from the fetched ticket
          // It is overridden when updated
          this.getView()
            .getModel("editTicketFormModel")
            .setProperty(
              "/teamMemberId",
              oEditTicketModel.getData().teamMemberId
            );

          this.getView()
            .getModel("editTicketFormModel")
            .setProperty("/customerId", oEditTicketModel.getData().customerId);
        } catch (error) {
          console.error(error);
          MessageBox.error(
            this.oBundle.getText("MBoxGETReqFailedOnTicketToEdit")
          );
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

        // Store the teamMemberId in model -> editTicketFormModel
        this.getView()
          .getModel("editTicketFormModel")
          .setProperty("/teamMemberId", oSelectedTeamMember.teamMemberId);

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
        //
        // If any Update Comment provided -> POST Request in order to add to TicketComment table
        //

        // PUT Request to Update Ticket
        const bIsUpdateSuccessful = await this._updateCustomerPUT();

        if (bIsUpdateSuccessful) {
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
        }
      },

      _updateCustomerPUT: async function () {
        // Retrieve values of Input fields
        const sTicketId = this.byId("ticketNumberEditInput").getValue();
        const sTicketTypeId = this.byId("ticketTypeEditInput").getSelectedKey();
        const sTeamMemberId = this.getView()
          .getModel("editTicketFormModel")
          .getProperty("/teamMemberId");
        const sCustomerId = this.getView()
          .getModel("editTicketFormModel")
          .getProperty("/customerId");
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
          await ticketService.updateTickets(parseInt(sTicketId), oPayload);
          // Success
          return true;
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
