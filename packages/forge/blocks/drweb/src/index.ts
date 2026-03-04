import { createBlock } from "@typebot.io/forge";
import { addAppointment } from "./actions/addAppointment";
import { addCustomer } from "./actions/addCustomer";
import { getAppointments } from "./actions/getAppointments";
import { getBranches } from "./actions/getBranches";
import { getFreeTime } from "./actions/getFreeTime";
import { getSchedulers } from "./actions/getSchedulers";
import { getToken } from "./actions/getToken";
import { searchCustomers } from "./actions/searchCustomers";
import { updateAppointment } from "./actions/updateAppointment";
import { auth } from "./auth";
import { DRWebLogo } from "./logo";

export const drwebBlock = createBlock({
  id: "drweb" as const,
  name: "DRWeb",
  fullName: "DRWeb Medical Appointment System",
  tags: ["medical", "appointments", "drweb", "crm"],
  LightLogo: DRWebLogo,
  auth,
  actions: [
    getToken,
    searchCustomers,
    addCustomer,
    getBranches,
    getSchedulers,
    getFreeTime,
    addAppointment,
    getAppointments,
    updateAppointment,
  ],
});
