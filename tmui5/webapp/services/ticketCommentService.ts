interface TicketComment {
  ticketCommentId: number;
  ticketId: number;
  comment: string;
  createdAt: Date;
}

interface TicketCommentPayload {
  ticketId: number;
  comment: string;
}

export default class ticketCommentService {
  public static async fetchTicketComments(
    iTicketId: number
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
