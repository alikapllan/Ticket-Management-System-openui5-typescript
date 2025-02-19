import Constants from "tmui5/constants/Constants";
import DateFormat from "sap/ui/core/format/DateFormat";

export default {
  /**
   * Formats date string into "dd/MM/yyyy HH:mm" format
   * @param sDate -> The date string in ISO format
   * @returns The formatted date string or an empty string if input is invalid
   */
  formatDateTime: (sDate: string) => {
    if (!sDate) {
      return "";
    }

    const oDate = new Date(sDate); // Convert ISO string to Date object
    const oDateFormat = DateFormat.getDateTimeInstance({
      pattern: "dd/MM/yyyy HH:mm",
    });

    return oDateFormat.format(oDate);
  },

  /**
   * Maps the ticket status name to the corresponding UI5 value state
   * @param this - The UI5 controller context for accessing the i18n model.
   * @param sTicketStatusName
   * @returns The corresponding value state for given statsu
   */
  getStatusState: (sTicketStatusName: string) => {
    switch (sTicketStatusName) {
      case "New":
        return Constants.VALUE_STATES.INFORMATION;
      case "In Planning":
        return Constants.VALUE_STATES.WARNING;
      case "In Progress":
        return Constants.VALUE_STATES.SUCCESS;
      case "Waiting For Customer Feedback":
        return Constants.VALUE_STATES.WARNING;
      case "On Hold":
        return Constants.VALUE_STATES.NONE;
      case "Canceled":
        return Constants.VALUE_STATES.ERROR;
      case "Done":
        return Constants.VALUE_STATES.SUCCESS;
      default:
        return Constants.VALUE_STATES.NONE;
    }
  },
};
