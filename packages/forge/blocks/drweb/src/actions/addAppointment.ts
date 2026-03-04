import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const addAppointment = createAction({
  auth,
  name: "Add New Appointment",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    appointmentDateTime: option.string.meta({
      layout: {
        label: "Appointment datetime (ISO)",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    duration: option.number.meta({
      layout: {
        label: "Duration (minutes)",
        defaultValue: 15,
      },
    }),
    branchID: option.string.meta({
      layout: {
        label: "Branch ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    schedulerID: option.string.meta({
      layout: {
        label: "Scheduler ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    customerID: option.string.meta({
      layout: {
        label: "Customer ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    priceListID: option.number.meta({
      layout: {
        label: "Price list ID",
        defaultValue: 1,
      },
    }),
    priceListCodeID: option.number.meta({
      layout: {
        label: "Price list code ID",
        defaultValue: 1,
      },
    }),
    saveAppointmentIdTo: option.string.meta({
      layout: {
        label: "Save appointment ID to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    saveSuccessTo: option.string.meta({
      layout: {
        label: "Save success (true/false) to variable",
        inputType: "variableDropdown",
      },
    }),
    saveErrorTo: option.string.meta({
      layout: {
        label: "Save error message to variable",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [
      options.saveAppointmentIdTo,
      options.saveSuccessTo,
      options.saveErrorTo,
    ].filter(isDefined),
});
