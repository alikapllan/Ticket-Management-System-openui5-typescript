sap.ui.define(
  [
    "tmui5/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("tmui5.controller.MainView", {
      onInit: function () {
        // Call the BaseController's onInit to initialize to be able to use 'oBundle'
        BaseController.prototype.onInit.apply(this, arguments);
        // onInit lifecycle method in the child controller overrides the onInit of the parent (BaseController)

        // json binding for generic tiles
        const oTilesModel = new JSONModel("../model/tiles.json");
        this.getView().setModel(oTilesModel, "tiles");
      },

      onPress: function (sRoute, sFragment) {
        if (sRoute) {
          this.navTo(sRoute);
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

        oDialog.close();

        oDialog.destroy(); // to avoid duplicate IDs when loading same dialog
      },
    });
  }
);
