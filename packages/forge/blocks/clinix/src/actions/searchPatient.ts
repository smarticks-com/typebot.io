import { createAction, option } from "@typebot.io/forge";
import { auth } from "../auth";

export const searchPatient = createAction({
  auth,
  name: "Search Patient",
  options: option.object({
    phone: option.string.meta({
      layout: { label: "Phone" },
    }),
    name: option.string.meta({
      layout: { label: "Name" },
    }),
    identity: option.string.meta({
      layout: { label: "Identity (TZ)" },
    }),
    saveResultId: option.string.meta({
      layout: { label: "Save patient ID", inputType: "variableDropdown" },
    }),
    saveResultName: option.string.meta({
      layout: { label: "Save patient name", inputType: "variableDropdown" },
    }),
    saveResultJson: option.string.meta({
      layout: {
        label: "Save full result (JSON)",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [
      options.saveResultId,
      options.saveResultName,
      options.saveResultJson,
    ].filter((id): id is string => !!id),
});
