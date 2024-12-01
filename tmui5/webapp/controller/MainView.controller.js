sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("tmui5.controller.MainView", {
      onInit: function () {
        // json binding for generic tiles
        const oTilesModel = new JSONModel("../model/tiles.json");
        this.getView().setModel(oTilesModel, "tiles");
      },

      onPress: function (sRoute) {
        this.getOwnerComponent().getRouter().navTo(sRoute);
      },
    });
  }
);
