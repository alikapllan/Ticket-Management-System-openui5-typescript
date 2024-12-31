/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "tmui5/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "tmui5/services/roleService",
    "tmui5/services/ticketTypeService",
    "tmui5/services/ticketStatusService",
  ],
  function (
    UIComponent,
    Device,
    models,
    JSONModel,
    MessageBox,
    roleService,
    ticketTypeService,
    ticketStatusService
  ) {
    "use strict";

    return UIComponent.extend("tmui5.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: async function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // Load i18n model explicitly
        const oResourceModel = this.getModel("i18n");
        const oBundle = oResourceModel.getResourceBundle();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // Initialize appState model
        this.initializeAppStateModel();

        // load roles once during application startup --> here called as Roles rarely change
        try {
          const roles = await roleService.fetchRoles();
          const oRoleModel = new JSONModel(roles);
          this.setModel(oRoleModel, "roleModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(oBundle.getText("MBoxGETReqFailedOnRole"));
        }

        // load ticket types and bind as model -> rarely changes
        try {
          const ticketTypes = await ticketTypeService.fetchTicketTypes();
          const oTicketTypeModel = new JSONModel(ticketTypes);
          this.setModel(oTicketTypeModel, "ticketTypeModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(oBundle.getText("MBoxGETReqFailedOnTicketType"));
        }

        // load ticket statuses and bind as model -> rarely changes
        try {
          const tickets = await ticketStatusService.fetchTicketStatuses();
          const oTicketStatusModel = new JSONModel(tickets);
          this.setModel(oTicketStatusModel, "ticketStatusModel");
        } catch (error) {
          console.error(error);
          MessageBox.error(oBundle.getText("MBoxGETReqFailedOnTicketStatus"));
        }
      },

      initializeAppStateModel: function () {
        // Initialize appState model to track the previous route (for Create Ticket nav. decision as it is called from two places)
        const oAppStateModel = new JSONModel({
          previousRoute: "",
        });
        this.setModel(oAppStateModel, "appState"); // Setting the appState model globally throughout the app
      },
    });
  }
);
