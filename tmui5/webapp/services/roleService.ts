interface Role {
  roleId: number;
  name: string;
}

export default class roleService {
  public static async fetchRoles(): Promise<Role[]> {
    const response = await fetch("http://localhost:3000/api/roles", {
      method: "GET",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Role Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }
}
