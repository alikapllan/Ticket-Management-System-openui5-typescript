import BaseController from "./BaseController";
import History from "sap/ui/core/routing/History";

export default class NotFound extends BaseController {
  public onInit(): void | undefined {}

  public onNavBackToHomePage(): void {
    this.navTo(this.Constants.ROUTES.MAIN);
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
