import { createAction, option } from "@typebot.io/forge";
import { auth } from "../auth";

export const bookAppointment = createAction({
  auth,
  name: "Book Appointment",
  options: option.object({
    schedulerID: option.string.meta({
      layout: { label: "Scheduler ID", isRequired: true },
    }),
    branchID: option.string.meta({
      layout: { label: "Branch ID", isRequired: true },
    }),
    customerID: option.string.meta({
      layout: { label: "Customer ID", isRequired: true },
    }),
    appointmentDateTime: option.string.meta({
      layout: {
        label: "Date & time",
        isRequired: true,
        helperText: "Format: yyyy-MM-dd HH:mm:ss",
      },
    }),
    duration: option.string.meta({
      layout: { label: "Duration (minutes)", isRequired: true },
    }),
    priceListID: option.string.meta({
      layout: { label: "Price list ID", isRequired: true },
    }),
    priceListCodeID: option.string.meta({
      layout: { label: "Price list code ID", isRequired: true },
    }),
    remark: option.string.meta({
      layout: { label: "Remark" },
    }),
    saveAppointmentId: option.string.meta({
      layout: {
        label: "Save appointment ID",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    options.saveAppointmentId ? [options.saveAppointmentId] : [],
});
