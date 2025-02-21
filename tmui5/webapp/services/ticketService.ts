import DateTime from "sap/ui/model/type/DateTime";

interface TicketPayload {
  ticketTypeId: number;
  teamMemberId: number;
  customerId: number;
  ticketStatusId: number;
  title: string;
  description: string;
}

interface Ticket {
  ticketId: number;
  ticketTypeId: number;
  teamMemberId: number;
  customerId: number;
  ticketStatusId: number;
  title: string;
  description: string;
  createdAt: DateTime;
}

export default class TicketService {
  public static async fetchTickets(): Promise<Ticket[]> {
    const response = await fetch("http://localhost:3000/api/tickets", {
      method: "GET",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Tickets Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async fetchTicket(iTicketId: number): Promise<Ticket> {
    const response = await fetch(
      `http://localhost:3000/api/tickets/${iTicketId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async fetchFilteredTickets(
    queryString: string
  ): Promise<Ticket[]> {
    const response = await fetch(
      `http://localhost:3000/api/tickets/filtered?${queryString}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Filtered Tickets Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async createTickets(oPayload: TicketPayload): Promise<Ticket> {
    const response = await fetch("http://localhost:3000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oPayload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Creation Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async uploadFiles(
    iTicketId: number,
    formData: FormData
  ): Promise<any> {
    const response = await fetch(
      `http://localhost:3000/api/tickets/${iTicketId}/files`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Files Upload Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async fetchTicketFiles(iTicketId: number): Promise<any> {
    const response = await fetch(
      `http://localhost:3000/api/tickets/${iTicketId}/files`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Files Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async deleteTickets(iTicketId: number): Promise<void> {
    const response = await fetch(
      `http://localhost:3000/api/tickets/${iTicketId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Tickets Deletion Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }
  }

  public static async updateTickets(
    iTicketId: number,
    oPayload: TicketPayload
  ): Promise<Ticket> {
    const response = await fetch(
      `http://localhost:3000/api/tickets/${iTicketId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(oPayload),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Tickets Update Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }
}
