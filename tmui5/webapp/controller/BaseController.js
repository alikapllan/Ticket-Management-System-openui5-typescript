sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("tmui5.controller.BaseController", {
    onInit: function () {
      // Initialize the i18n resource bundle
      this.oBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();
    },
    /**
     * @private
     */
    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },
    /**
     * @public
     */
    navTo: function (sRoute) {
      this.getRouter().navTo(sRoute, {}, true);
    },
  });
});
