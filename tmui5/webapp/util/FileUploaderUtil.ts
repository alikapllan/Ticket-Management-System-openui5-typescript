import MessageBox from "sap/m/MessageBox";
import ticketService from "tmui5/services/ticketService";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import UploadSet from "sap/m/upload/UploadSet";
import Integer from "sap/ui/model/type/Integer";

export default class FileUploaderUtil {
  public static async uploadFiles(
    ticketId: Integer,
    oFileUploader: UploadSet
  ): Promise<void> {
    const oDomRef = oFileUploader.getDomRef("fu") as HTMLInputElement;
    const aFiles = oDomRef?.files;

    if (aFiles) {
      const formData = new FormData();
      formData.append("ticketId", ticketId.toString());

      for (const file of Array.from(aFiles)) {
        formData.append("files", file);
      }

      try {
        await ticketService.uploadFiles(ticketId, formData);
      } catch (error) {
        console.error(
          `Failed to upload files for ticketID ${ticketId}:`,
          error
        );
      }
    }
  }

  public static handleFilenameLengthExceed(oBundle: ResourceBundle): void {
    MessageBox.error(oBundle.getText("MBoxFileNameLengthCannotExceed50Char"));
  }

  public static handleTypeMissmatch(
    oEvent: any,
    oBundle: ResourceBundle
  ): void {
    const aFileTypes = (oEvent.getSource() as UploadSet).getFileTypes();
    const sSupportedTypes = aFileTypes.map((sType) => `*.${sType}`).join(", ");

    const sMessage = oBundle.getText("fileTypeNotSupported", [
      `*.${oEvent.getParameter("fileType")}`,
      sSupportedTypes,
    ]);

    MessageBox.error(sMessage);
  }

  public static async loadTicketFiles(
    iTicketId: Integer,
    oBundle: ResourceBundle
  ): Promise<JSONModel | undefined> {
    try {
      const ticketFiles = await ticketService.fetchTicketFiles(iTicketId);
      return new JSONModel(ticketFiles);
    } catch (error) {
      console.error(error);
      MessageBox.error(oBundle.getText("MBoxGETReqFailedOnFiles"));
    }
  }
}
