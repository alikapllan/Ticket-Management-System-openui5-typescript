sap.ui.define([], function () {
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
  };
});
