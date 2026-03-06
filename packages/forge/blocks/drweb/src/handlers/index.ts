import { addAppointmentHandler } from "./addAppointmentHandler";
import { addCrmTicketActionHandler } from "./addCrmTicketActionHandler";
import { addCustomerHandler } from "./addCustomerHandler";
import { getAppointmentByIDHandler } from "./getAppointmentByIDHandler";
import { getAppointmentLabelsHandler } from "./getAppointmentLabelsHandler";
import { getAppointmentsHandler } from "./getAppointmentsHandler";
import { getBranchesHandler } from "./getBranchesHandler";
import { getCustomerByIDHandler } from "./getCustomerByIDHandler";
import { getFreeTimeHandler } from "./getFreeTimeHandler";
import { getSchedulersHandler } from "./getSchedulersHandler";
import { getTokenHandler } from "./getTokenHandler";
import { saveCrmTicketHandler } from "./saveCrmTicketHandler";
import { searchCustomersHandler } from "./searchCustomersHandler";
import { updateAppointmentHandler } from "./updateAppointmentHandler";

export default [
  getTokenHandler,
  searchCustomersHandler,
  addCustomerHandler,
  getCustomerByIDHandler,
  getBranchesHandler,
  getSchedulersHandler,
  getFreeTimeHandler,
  addAppointmentHandler,
  getAppointmentsHandler,
  getAppointmentByIDHandler,
  updateAppointmentHandler,
  getAppointmentLabelsHandler,
  saveCrmTicketHandler,
  addCrmTicketActionHandler,
];
