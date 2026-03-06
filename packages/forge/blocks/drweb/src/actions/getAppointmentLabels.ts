import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getAppointmentLabels = createAction({
  auth,
  name: "Get Appointment Labels",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    saveResultsTo: option.string.meta({
      layout: {
        label: "Save labels JSON to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultsTo].filter(isDefined),
});
