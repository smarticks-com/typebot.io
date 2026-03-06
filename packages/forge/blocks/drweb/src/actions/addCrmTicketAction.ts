import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const addCrmTicketAction = createAction({
  auth,
  name: "Add CRM Ticket Action",
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
    actionTypeID: option.string.meta({
      layout: {
        label: "Action Type ID",
        defaultValue: "1",
        withVariableButton: true,
      },
    }),
    description: option.string.meta({
      layout: {
        label: "Description",
        withVariableButton: true,
        isRequired: true,
        inputType: "textarea",
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
