sap.ui.define(
  ["sap/m/MessageBox", "tmui5/services/ticketService"],
  function (MessageBox, ticketService) {
    "use strict";

    return {
      uploadFiles: async function (ticketId, oFileUploader) {
        const oDomRef = oFileUploader.getDomRef("fu");
        const aFiles = oDomRef && oDomRef.files; // Get all selected files

        if (aFiles) {
          const formData = new FormData();
          formData.append("ticketId", ticketId);

          for (const file of aFiles) {
            formData.append("files", file);
          }

          try {
            await ticketService.uploadFiles(ticketId, formData);
          } catch (error) {
            console.error(
              `Failed to upload files for ticketID ${ticketId}: `,
              error
            );
          }
        }
      },
      handleFilenameLengthExceed: function (oBundle) {
        MessageBox.error(
          oBundle.getText("MBoxFileNameLengthCannotExceed50Char")
        );
      },

      handleTypeMissmatch: function (oEvent, oBundle) {
        const aFileTypes = oEvent.getSource().getFileType();
        const sSupportedTypes = aFileTypes
          .map((sType) => "*." + sType)
          .join(", ");

        // Prepare message with dynamic values
        const sMessage = oBundle.getText("fileTypeNotSupported", [
          "*." + oEvent.getParameter("fileType"),
          sSupportedTypes,
        ]);

        MessageBox.error(sMessage);
      },
    };
  }
);
