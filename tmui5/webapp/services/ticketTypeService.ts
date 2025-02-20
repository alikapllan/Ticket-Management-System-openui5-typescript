import Integer from "sap/ui/model/type/Integer";

interface TicketType {
  ticketTypeId: Integer;
  name: string;
}

export default class ticketTypeService {
  public static async fetchTicketTypes(): Promise<TicketType[]> {
    const response = await fetch("http://localhost:3000/api/ticketTypes", {
      method: "GET",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Ticket Types Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }
}
