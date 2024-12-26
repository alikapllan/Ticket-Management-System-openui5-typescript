sap.ui.define(["tmui5/constants/Constants"], function (Constants) {
  "use strict";

  return {
    formatDateTime: function (sDate) {
      if (!sDate) {
        return "";
      }

      const oDate = new Date(sDate); // Convert ISO string to Date object

      const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
        pattern: "dd/MM/yyyy HH:mm",
      });

      return oDateFormat.format(oDate);
    },

    getStatusState: function (sStatus) {
      if (!sStatus) {
        return Constants.VALUE_STATES.NONE; // Default state if status is missing
      }

      const oResourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      switch (sStatus) {
        case oResourceBundle.getText("statusNew"):
          return Constants.VALUE_STATES.INFORMATION;
        case oResourceBundle.getText("statusInPlanning"):
          return Constants.VALUE_STATES.WARNING;
        case oResourceBundle.getText("statusInProgress"):
          return Constants.VALUE_STATES.SUCCESS;
        case oResourceBundle.getText("statusWaitingForCustomerFeedback"):
          return Constants.VALUE_STATES.WARNING;
        case oResourceBundle.getText("statusOnHold"):
          return Constants.VALUE_STATES.NONE;
        case oResourceBundle.getText("statusCanceled"):
          return Constants.VALUE_STATES.ERROR;
        case oResourceBundle.getText("statusDone"):
          return Constants.VALUE_STATES.SUCCESS;
        default:
          return Constants.VALUE_STATES.NONE;
      }
    },
  };
});
