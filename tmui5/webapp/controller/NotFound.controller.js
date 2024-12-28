sap.ui.define(
  ["tmui5/controller/BaseController", "sap/ui/core/routing/History"],
  function (BaseController, History) {
    "use strict";

    return BaseController.extend("tmui5.controller.NotFound", {
      onInit: function () {},

      onNavBackToHomePage: function () {
        this.navTo("RouteMainView");
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
