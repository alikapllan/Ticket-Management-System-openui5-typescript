sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("tmui5.controller.MainView", {
      onInit: function () {
        // json binding for generic tiles
        const oTilesModel = new JSONModel("../model/tiles.json");
        this.getView().setModel(oTilesModel, "tiles");

        // Load the i18n resource bundle for retrieving localized texts
        this.oBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
      },

      onPress: function (sRoute, sFragment) {
        if (sRoute) {
          this.getOwnerComponent().getRouter().navTo(sRoute);
        } else if (sFragment) {
          // fragment
          this.onOpenDialog(sFragment);
        } else {
          MessageToast.show(this.oBundle.getText("noActionDefined"));
        }
      },

      onOpenDialog: async function (sFragment) {
        try {
          const oDialog = await this.loadFragment({
            name: sFragment,
          });

          oDialog.open();
        } catch (error) {
          console.log(error);
          MessageToast.show(this.oBundle.getText("failedFragmentLoad"));
        }
      },

      onCloseDialog: function (oEvent) {
        // get the source of button that triggered the event
        const oSource = oEvent.getSource();
        // find parent dialog from that button
        const oDialog = oSource.getParent();

        if (oDialog && oDialog.isA("sap.m.Dialog")) {
          oDialog.close();

          oDialog.destroy(); // to avoid duplicate IDs when loading same dialog
        } else {
          MessageToast.show(this.oBundle.getText("failedFragmentClose"));
        }
      },
    });
  }
);
