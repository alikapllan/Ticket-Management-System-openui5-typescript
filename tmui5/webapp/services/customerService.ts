interface CustomerPayload {
  name: string;
  email: string;
  phone: string;
}

interface Customer extends CustomerPayload {
  customerId: number;
}

export default class customerService {
  public static async fetchCustomers(): Promise<Customer> {
    const response = await fetch("http://localhost:3000/api/customers", {
      method: "GET",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Customer Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async createCustomers(oPayload: CustomerPayload): Promise<any> {
    const response = await fetch("http://localhost:3000/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oPayload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Customer Creation Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async deleteCustomers(iCustomerId: number): Promise<void> {
    const response = await fetch(
      `http://localhost:3000/api/customers/${iCustomerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Customer Deletion Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }
  }
}
