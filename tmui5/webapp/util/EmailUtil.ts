import Constants from "tmui5/constants/Constants";
import ticketEmailService from "tmui5/services/ticketEmailService";

interface EmailPayload {
  ticketId: number;
  teamMemberEmail: string;
  teamMemberFullName: string;
  title: string;
  description: string;
}

export const EmailUtil = {
  sendEmail: async (
    emailSendingType: string,
    emailPayload: EmailPayload
  ): Promise<void> => {
    try {
      if (emailSendingType === Constants.EMAIL_SENDING_TYPE.CREATED) {
        await ticketEmailService.sendTicketCreatedEmail(emailPayload);
      } else if (emailSendingType === Constants.EMAIL_SENDING_TYPE.UPDATED) {
        await ticketEmailService.sendTicketUpdatedEmail(emailPayload);
      }
    } catch (error) {
      console.error(`Failed to send ${emailSendingType} email:`, error);
    }
  },
};

export default EmailUtil;
