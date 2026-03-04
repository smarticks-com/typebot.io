import { addAppointmentHandler } from "./addAppointmentHandler";
import { addCustomerHandler } from "./addCustomerHandler";
import { getAppointmentsHandler } from "./getAppointmentsHandler";
import { getBranchesHandler } from "./getBranchesHandler";
import { getFreeTimeHandler } from "./getFreeTimeHandler";
import { getSchedulersHandler } from "./getSchedulersHandler";
import { getTokenHandler } from "./getTokenHandler";
import { searchCustomersHandler } from "./searchCustomersHandler";
import { updateAppointmentHandler } from "./updateAppointmentHandler";

export default [
  getTokenHandler,
  searchCustomersHandler,
  addCustomerHandler,
  getBranchesHandler,
  getSchedulersHandler,
  getFreeTimeHandler,
  addAppointmentHandler,
  getAppointmentsHandler,
  updateAppointmentHandler,
];
