import UIComponent from "sap/ui/core/UIComponent";
import models from "tmui5/model/models";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import roleService from "tmui5/services/roleService";
import ticketTypeService from "tmui5/services/ticketTypeService";
import ticketStatusService from "tmui5/services/ticketStatusService";
import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace tmui5
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json",
  };

  /**
   * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
   * @public
   * @override
   */
  public async init(): Promise<void> {
    // Call the base component's init function
    super.init();

    // Enable routing
    this.getRouter().initialize();

    // Load i18n model explicitly
    const oResourceModel = this.getModel("i18n") as ResourceModel;
    const oBundle: ResourceBundle = await oResourceModel.getResourceBundle();

    // Set the device model
    this.setModel(models.createDeviceModel(), "device");

    // Initialize appState model
    this.initializeAppStateModel();

    // Load roles once during application startup
    try {
      const roles = await roleService.fetchRoles();
      const oRoleModel = new JSONModel(roles);
      this.setModel(oRoleModel, "roleModel");
    } catch (error) {
      console.error(error);
      MessageBox.error(oBundle.getText("MBoxGETReqFailedOnRole"));
    }

    // Load ticket types and bind as model
    try {
      const ticketTypes = await ticketTypeService.fetchTicketTypes();
      const oTicketTypeModel = new JSONModel(ticketTypes);
      this.setModel(oTicketTypeModel, "ticketTypeModel");
    } catch (error) {
      console.error(error);
      MessageBox.error(oBundle.getText("MBoxGETReqFailedOnTicketType"));
    }

    // Load ticket statuses and bind as model
    try {
      const tickets = await ticketStatusService.fetchTicketStatuses();
      const oTicketStatusModel = new JSONModel(tickets);
      this.setModel(oTicketStatusModel, "ticketStatusModel");
    } catch (error) {
      console.error(error);
      MessageBox.error(oBundle.getText("MBoxGETReqFailedOnTicketStatus"));
    }
  }

  /**
   * Initialize appState model to track the previous route (for Create Ticket navigation decision as it is called from two places)
   */
  public initializeAppStateModel(): void {
    const oAppStateModel = new JSONModel({
      previousRoute: "",
    });
    this.setModel(oAppStateModel, "appState");
  }
}
