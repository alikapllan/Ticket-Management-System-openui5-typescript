import BaseController from "./BaseController";
import History from "sap/ui/core/routing/History";

export default class KanbanView extends BaseController {
  public onInit(): void | undefined {
    super.onInit();
  }

  public onNavBack(): void {
    const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();

    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      this.navTo(this.Constants.ROUTES.MAIN);
    }
  }
}
