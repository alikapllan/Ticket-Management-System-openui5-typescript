import DateTime from "sap/ui/model/type/DateTime";
import Integer from "sap/ui/model/type/Integer";

interface TicketComment {
  ticketCommentId: Integer;
  ticketId: Integer;
  comment: string;
  createdAt: DateTime;
}

interface TicketCommentPayload {
  ticketId: Integer;
  comment: string;
}

export default class ticketCommentService {
  public static async fetchTicketComments(
    iTicketId: Integer
  ): Promise<TicketComment[]> {
    const response = await fetch(
      `http://localhost:3000/api/ticketComments/${iTicketId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Comments Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async createTicketComment(
    oPayload: TicketCommentPayload
  ): Promise<any> {
    const response = await fetch("http://localhost:3000/api/ticketComments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // tells the server the body is JSON
      },
      body: JSON.stringify(oPayload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Comment Creation Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }
}
