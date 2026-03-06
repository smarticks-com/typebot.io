import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const saveCrmTicket = createAction({
  auth,
  name: "Save CRM Ticket",
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
    firstName: option.string.meta({
      layout: {
        label: "First name",
        withVariableButton: true,
      },
    }),
    lastName: option.string.meta({
      layout: {
        label: "Last name",
        withVariableButton: true,
      },
    }),
    phoneNumber: option.string.meta({
      layout: {
        label: "Phone number",
        withVariableButton: true,
      },
    }),
    reasonID: option.string.meta({
      layout: {
        label: "Reason ID (1=interesting, 2=service, 3=retention)",
        defaultValue: "2",
        withVariableButton: true,
      },
    }),
    details: option.string.meta({
      layout: {
        label: "Details / description",
        withVariableButton: true,
        isRequired: true,
        inputType: "textarea",
      },
    }),
    status: option.string.meta({
      layout: {
        label: "Status (1=new, 2=inProgress, 3=close, 4=scheduled)",
        defaultValue: "1",
        withVariableButton: true,
      },
    }),
    saveTicketIdTo: option.string.meta({
      layout: {
        label: "Save ticket ID to variable",
        inputType: "variableDropdown",
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
    [options.saveTicketIdTo, options.saveSuccessTo, options.saveErrorTo].filter(
      isDefined,
    ),
});
