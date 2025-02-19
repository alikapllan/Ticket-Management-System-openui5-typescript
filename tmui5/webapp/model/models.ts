import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";
import BindingMode from "sap/ui/model/BindingMode";

/**
 * provide app-view type models (as in the first "V" in MVVC)
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.Device} Device
 *
 * @returns {JSONModel} device model providing runtime info for the device the UI5 app is running on
 */
export const createDeviceModel = (): JSONModel => {
  const oModel = new JSONModel(Device);
  oModel.setDefaultBindingMode("OneWay" as BindingMode);
  return oModel;
};

export default { createDeviceModel };
