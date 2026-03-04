import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const addCustomer = createAction({
  auth,
  name: "Add New Customer",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    firstName: option.string.meta({
      layout: {
        label: "First name",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    lastName: option.string.meta({
      layout: {
        label: "Last name",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    identity: option.string.meta({
      layout: {
        label: "Identity (TZ)",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    phoneNumber: option.string.meta({
      layout: {
        label: "Phone number",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    saveIdTo: option.string.meta({
      layout: {
        label: "Save customerID to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) => [options.saveIdTo].filter(isDefined),
});
