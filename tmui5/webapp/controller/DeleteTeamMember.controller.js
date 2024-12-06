sap.ui.define(
  ["tmui5/controller/BaseController", "sap/ui/core/routing/History"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, History) {
    "use strict";

    return BaseController.extend("tmui5.controller.DeleteTeamMember", {
      onInit: function () {},

      onDeleteSelectedTeamMember: function () {},

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
