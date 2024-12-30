sap.ui.define(
  ["tmui5/constants/Constants", "tmui5/services/ticketEmailService"],
  function (Constants, ticketEmailService) {
    "use strict";

    return {
      sendEmail: async function (emailSendingType, emailPayload) {
        try {
          if (emailSendingType === Constants.EMAIL_SENDING_TYPE.CREATED) {
            await ticketEmailService.sendTicketCreatedEmail(emailPayload);
          } else if (
            emailSendingType === Constants.EMAIL_SENDING_TYPE.UPDATED
          ) {
            await ticketEmailService.sendTicketUpdatedEmail(emailPayload);
          }
        } catch (error) {
          console.error(`Failed to send ${emailSendingType} email:`, error);
        }
      },
    };
  }
);
