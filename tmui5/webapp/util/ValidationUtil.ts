import TextArea from "sap/m/TextArea";
import Event from "sap/ui/base/Event";

/**
 * Validation utility to check the length of textarea input
 *
 * @param oEvent - The event triggered by the textarea live change
 * @param Constants - Constants object for value states
 */
export const validateTextAreaLength = (
  oEvent: Event,
  oControllerInstance: any
): void => {
  const oTextArea = oEvent.getSource() as TextArea;
  const iValueLength = oTextArea.getValue().length;
  const iMaxLength = oTextArea.getMaxLength();

  const sState =
    iValueLength > iMaxLength
      ? oControllerInstance.ValueState.Error
      : oControllerInstance.ValueState.None;

  oTextArea.setValueState(sState);
};

export default { validateTextAreaLength };
