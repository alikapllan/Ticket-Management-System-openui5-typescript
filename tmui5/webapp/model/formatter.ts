import DateFormat from "sap/ui/core/format/DateFormat";
import { ValueState } from "sap/ui/core/library";

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
   * @param this - The UI5 controller context for accessing the i18n model & ValueState from sap.ui.core.library
   * @param sTicketStatusName
   * @returns The corresponding value state for given statsu
   */
  // Don’t use an arrow function here—arrow syntax locks `this` to the module scope,
  // so UI5 can’t bind the controller instance and `this.getOwnerComponent()` will fail.
  getStatusState(sTicketStatusName: string): ValueState {
    if (!sTicketStatusName) {
      return this.ValueState.None; // Default state if status is missing
    }

    const oResourceBundle = this.getOwnerComponent()
      .getModel("i18n")
      .getResourceBundle();

    switch (sTicketStatusName) {
      case oResourceBundle.getText("statusNew"):
        return this.ValueState.Information;
      case oResourceBundle.getText("statusInPlanning"):
        return this.ValueState.Warning;
      case oResourceBundle.getText("statusInProgress"):
        return this.ValueState.Success;
      case oResourceBundle.getText("statusWaitingForCustomerFeedback"):
        return this.ValueState.Warning;
      case oResourceBundle.getText("statusOnHold"):
        return this.ValueState.None;
      case oResourceBundle.getText("statusCanceled"):
        return this.ValueState.Error;
      case oResourceBundle.getText("statusDone"):
        return this.ValueState.Success;
      default:
        return this.ValueState.None;
    }
  },
};
