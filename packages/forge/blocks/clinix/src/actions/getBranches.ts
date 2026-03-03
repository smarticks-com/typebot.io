import { createAction, option } from "@typebot.io/forge";
import { auth } from "../auth";

export const getBranches = createAction({
  auth,
  name: "Get Branches",
  options: option.object({
    saveResultJson: option.string.meta({
      layout: {
        label: "Save branches list (JSON)",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    options.saveResultJson ? [options.saveResultJson] : [],
});
