import TextArea from "sap/m/TextArea";
import Event from "sap/ui/base/Event";
import Constants from "tmui5/constants/Constants";

/**
 * Validation utility to check the length of textarea input
 *
 * @param oEvent - The event triggered by the textarea live change
 * @param Constants - Constants object for value states
 */
export const validateTextAreaLength = (
  oEvent: Event,
  Constants: Constants
): void => {
  const oTextArea = oEvent.getSource() as TextArea;
  const iValueLength = oTextArea.getValue().length;
  const iMaxLength = oTextArea.getMaxLength();

  const sState =
    iValueLength > iMaxLength
      ? Constants.VALUE_STATES.ERROR
      : Constants.VALUE_STATES.NONE;

  oTextArea.setValueState(sState);
};

export default { validateTextAreaLength };
