import BaseController from "tmui5/controller/BaseController";
import History from "sap/ui/core/routing/History";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import GridList from "sap/f/GridList";
import GridListItem from "sap/f/GridListItem";
import VBox from "sap/m/VBox";
import Title from "sap/m/Title";
import Label from "sap/m/Label";
import DragInfo from "sap/ui/core/dnd/DragInfo";
import GridDropInfo from "sap/f/dnd/GridDropInfo";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import CustomData from "sap/ui/core/CustomData";
import CSSGrid from "sap/ui/layout/cssgrid/CSSGrid";

import ticketStatusService from "tmui5/services/ticketStatusService";
import ticketService from "tmui5/services/ticketService";

interface ITicketStatus {
  ticketStatusId: number;
  ticketStatusName: string;
}

interface ITicket {
  ticketId: number;
  ticketTypeId: string;
  teamMemberId: string;
  customerId: string;
  ticketStatusId: string;
  title: string;
  description: string;
}

export default class KanbanView extends BaseController {
  public async onInit(): Promise<void> {
    super.onInit();

    await this._ensureModelsLoaded();
    const aStatuses = this._getStatusModel().getData() as ITicketStatus[];
    this._renderColumnsForEachTicketStatus(aStatuses);
  }

  // Data loading
  private async _ensureModelsLoaded(): Promise<void> {
    const modelHasData = (model?: JSONModel): model is JSONModel =>
      !!model && Array.isArray(model.getData()) && model.getData().length > 0;

    if (!modelHasData(this._getTicketModel())) {
      await this.loadTickets();
    }

    if (!modelHasData(this._getTicketModel())) {
      MessageBox.error(this.oBundle.getText("MBoxNoTicketsAvaliable"));
      return;
    }

    // load statuses if missing
    if (!modelHasData(this._getStatusModel())) {
      try {
        const aStatuses = await ticketStatusService.fetchTicketStatuses();
        this.getOwnerComponent().setModel(
          new JSONModel(aStatuses),
          "ticketStatusModel"
        );
      } catch (err) {
        MessageBox.error(
          this.oBundle.getText("MBoxGETReqFailedOnTicketStatus")
        );
        console.error(err);
      }
    }
  }

  private _getTicketModel(): JSONModel {
    return this.getOwnerComponent().getModel("ticketModel") as JSONModel;
  }

  private _getStatusModel(): JSONModel {
    return this.getOwnerComponent().getModel("ticketStatusModel") as JSONModel;
  }

  // Rendering
  private _renderColumnsForEachTicketStatus(aStatuses: ITicketStatus[]): void {
    const oContainer = this.byId("cssGridContainer") as CSSGrid;
    oContainer.removeAllItems();

    aStatuses.forEach((oStatus) => {
      oContainer.addItem(this._createColumnEntryForEachTicket(oStatus));
    });
  }

  private _createColumnEntryForEachTicket(oStatus: ITicketStatus): GridList {
    const oGridList = new GridList({
      headerText: oStatus.ticketStatusName,
      customData: [
        new CustomData({
          key: "ticketStatusId",
          value: oStatus.ticketStatusId,
        }),
      ],
      items: {
        path: "ticketModel>/",
        filters: [
          new Filter(
            "ticketStatusId",
            FilterOperator.EQ,
            oStatus.ticketStatusId
          ),
        ],
        templateShareable: true,
        template: new GridListItem({
          type: "Active",
          content: [
            new VBox({
              alignItems: "Center",
              justifyContent: "Center",
              height: "100%",
              items: [
                new Title({
                  text: "{ticketModel>ticketId}",
                  wrapping: true,
                  textAlign: "Center",
                }),
                new Label({
                  text: "{ticketModel>title}",
                  wrapping: true,
                  textAlign: "Center",
                }),
              ],
            }),
          ],
        }),
      },
    });

    oGridList.addDragDropConfig(new DragInfo({ sourceAggregation: "items" }));
    oGridList.addDragDropConfig(
      new GridDropInfo({
        targetAggregation: "items",
        dropPosition: "OnOrBetween",
        dropLayout: "Horizontal",
        drop: this._onDrop.bind(this),
      })
    );

    return oGridList;
  }

  // Drag & Drop Handler
  private async _onDrop(oEvent: any): Promise<void> {
    const oDraggedItem = oEvent.getParameter("draggedControl") as GridListItem;
    const oDroppedList = (
      oEvent.getSource() as GridDropInfo
    ).getParent() as GridList;

    const oDraggedBindingContext =
      oDraggedItem.getBindingContext("ticketModel")!;
    const oDraggedData = oDraggedBindingContext.getObject() as ITicket;

    const sNewStatusId = oDroppedList
      .getCustomData()
      .find((d) => d.getKey() === "ticketStatusId")!
      .getValue() as string;

    if (oDraggedData.ticketStatusId === sNewStatusId) {
      return;
    }

    // update model
    const aTickets = this._getTicketModel().getData();
    const oTicket = aTickets.find(
      (t: ITicket) => t.ticketId === oDraggedData.ticketId
    );
    if (!oTicket) {
      return;
    }

    oTicket.ticketStatusId = sNewStatusId;

    // call backend to update tcket status
    const oPayload = { ...oTicket };
    try {
      const oResponse = await ticketService.updateTickets(
        oTicket.ticketId,
        oPayload
      );

      // update ticket model
      await this.loadTickets();

      const sTicketStatusText = this._getTicketModel()
        .getData()
        .find(
          (t: ITicket) => t.ticketId === oResponse.ticketId
        )!.ticketStatusName;

      MessageToast.show(
        this.oBundle.getText("MToastTicketSuccesfullyMovedToStatus", [
          oTicket.ticketId,
          sTicketStatusText,
        ])
      );
    } catch (err) {
      MessageBox.error(this.oBundle.getText("MBoxFailedToUpdateTicketStatus"));
      console.error(err);
    }
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
