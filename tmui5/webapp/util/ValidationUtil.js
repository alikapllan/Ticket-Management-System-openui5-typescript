sap.ui.define([], function () {
  "use strict";

  return {
    validateTextAreaLength: function (oEvent, Constants) {
      const oTextArea = oEvent.getSource(),
        iValueLength = oTextArea.getValue().length,
        iMaxLength = oTextArea.getMaxLength(),
        sState =
          iValueLength > iMaxLength
            ? Constants.VALUE_STATES.ERROR
            : Constants.VALUE_STATES.NONE;

      oTextArea.setValueState(sState);
    },
  };
});
