interface TicketStatus {
  ticketStatusId: number;
  name: string;
}

export default class ticketStatusService {
  public static async fetchTicketStatuses(): Promise<TicketStatus[]> {
    const response = await fetch("http://localhost:3000/api/ticketStatus", {
      method: "GET",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Status Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }
}
