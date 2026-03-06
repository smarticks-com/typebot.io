import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getAppointments = createAction({
  auth,
  name: "Get Appointments",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    customerID: option.string.meta({
      layout: {
        label: "Filter by Customer ID (optional)",
        withVariableButton: true,
        helperText: "If set, only returns appointments for this customer",
      },
    }),
    futureOnly: option.string.meta({
      layout: {
        label: "Future only (true/false)",
        defaultValue: "false",
        withVariableButton: true,
        helperText: "If true, only returns non-cancelled future appointments",
      },
    }),
    maxResults: option.number.meta({
      layout: {
        label: "Max results",
        defaultValue: 100,
      },
    }),
    saveResultsTo: option.string.meta({
      layout: {
        label: "Save appointments JSON to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultsTo].filter(isDefined),
});
