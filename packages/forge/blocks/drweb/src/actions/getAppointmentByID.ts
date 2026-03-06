import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getAppointmentByID = createAction({
  auth,
  name: "Get Appointment By ID",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    appointmentID: option.string.meta({
      layout: {
        label: "Appointment ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    saveResultTo: option.string.meta({
      layout: {
        label: "Save appointment JSON to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultTo].filter(isDefined),
});
