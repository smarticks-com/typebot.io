import { createAction, option } from "@typebot.io/forge";
import { auth } from "../auth";

export const registerPatient = createAction({
  auth,
  name: "Register Patient",
  options: option.object({
    firstName: option.string.meta({
      layout: { label: "First name", isRequired: true },
    }),
    lastName: option.string.meta({
      layout: { label: "Last name", isRequired: true },
    }),
    identity: option.string.meta({
      layout: { label: "Identity (TZ)", isRequired: true },
    }),
    mobile: option.string.meta({
      layout: { label: "Mobile phone" },
    }),
    email: option.string.meta({
      layout: { label: "Email" },
    }),
    saveCustomerId: option.string.meta({
      layout: { label: "Save customer ID", inputType: "variableDropdown" },
    }),
  }),
  getSetVariableIds: (options) =>
    options.saveCustomerId ? [options.saveCustomerId] : [],
});
