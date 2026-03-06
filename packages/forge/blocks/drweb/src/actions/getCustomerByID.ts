import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getCustomerByID = createAction({
  auth,
  name: "Get Customer By ID",
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
        label: "Customer ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    saveResultTo: option.string.meta({
      layout: {
        label: "Save customer JSON to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultTo].filter(isDefined),
});
