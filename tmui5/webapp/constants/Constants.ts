export default class Constants {
  static readonly FRAGMENTS = {
    ASSIGNED_TO_VALUEHELP: "tmui5.view.valueHelpFragments.AssignedToValueHelp",
    CUSTOMER_VALUEHELP: "tmui5.view.valueHelpFragments.CustomerValueHelp",
    TICKET_ID_VALUEHELP: "tmui5.view.valueHelpFragments.TicketIdValueHelp",
  };

  static readonly FRAGMENTS_ID = {
    ASSIGNED_TO_VALUEHELP: "AssignedToValueHelp",
    CUSTOMER_VALUEHELP: "CustomerValueHelp",
    TICKET_ID_VALUEHELP: "TicketIdValueHelp",
  };

  static readonly VALUE_STATES = {
    INFORMATION: "Information",
    SUCCESS: "Success",
    WARNING: "Warning",
    ERROR: "Error",
    NONE: "None",
  };

  static readonly EMAIL_SENDING_TYPE = {
    CREATED: "created",
    UPDATED: "updated",
  };

  static readonly ROUTES = {
    MAIN: "RouteMainView",
    TICKET_OVERVIEW: "RouteTicketOverview",
    EDIT_TICKET: "RouteEditTicket",
    CREATE_TICKET: "RouteCreateTicket",
    DELETE_TEAM_MEMBER: "RouteDeleteTeamMember",
    DELETE_CUSTOMER: "RouteDeleteCustomer",
  };
}
