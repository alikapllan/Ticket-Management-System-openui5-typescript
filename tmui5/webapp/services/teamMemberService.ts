import Integer from "sap/ui/model/type/Integer";

interface TeamMemberPayload {
  name: string;
  surname: string;
  roleId: Integer;
  email: string;
  phone: string;
}

interface TeamMember extends TeamMemberPayload {
  teamMemberId: Integer;
}

export default class TeamMemberService {
  public static async fetchTeamMembers(): Promise<TeamMember> {
    const response = await fetch("http://localhost:3000/api/teamMembers", {
      method: "GET",
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Team Member Fetch Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async createTeamMembers(
    oPayload: TeamMemberPayload
  ): Promise<TeamMemberPayload> {
    const response = await fetch("http://localhost:3000/api/teamMembers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oPayload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Team Member Creation Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  public static async deleteTeamMembers(iTeamMemberId: Integer): Promise<void> {
    const response = await fetch(
      `http://localhost:3000/api/teamMembers/${iTeamMemberId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Team Member Deletion Error: ${response.status} - ${
          errorBody.message || response.statusText
        }`
      );
    }
  }
}
