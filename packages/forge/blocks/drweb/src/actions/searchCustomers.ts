import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const searchCustomers = createAction({
  auth,
  name: "Search Customers",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        isRequired: true,
        label: "API Token variable",
        inputType: "variableDropdown",
        helperText: "The variable holding api_token",
      },
    }),
    phone: option.string.meta({
      layout: {
        isRequired: true,
        label: "Phone number",
        placeholder: "{{callerid}}",
        withVariableButton: true,
      },
    }),
    maxResults: option.number.meta({
      layout: {
        label: "Max results",
        defaultValue: 10,
      },
    }),
    saveResultsTo: option.string.meta({
      layout: {
        isRequired: true,
        label: "Save results array to variable",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultsTo].filter(isDefined),
});
