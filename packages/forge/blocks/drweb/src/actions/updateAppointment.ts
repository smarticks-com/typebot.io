import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const updateAppointment = createAction({
  auth,
  name: "Update Appointment (Cancel)",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    appointmentJson: option.string.meta({
      layout: {
        label: "Full appointment JSON (variable)",
        withVariableButton: true,
        isRequired: true,
        helperText:
          "Pass the full appointment object as JSON string from cancel_appointment_json",
      },
    }),
    customerID: option.string.meta({
      layout: {
        label: "Customer ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    cancelReasonID: option.number.meta({
      layout: {
        label: "Cancel reason ID",
        defaultValue: 1,
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
    [options.saveSuccessTo, options.saveErrorTo].filter(isDefined),
});
