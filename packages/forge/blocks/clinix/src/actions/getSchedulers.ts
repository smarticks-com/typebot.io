import { createAction, option } from "@typebot.io/forge";
import { auth } from "../auth";

export const getSchedulers = createAction({
  auth,
  name: "Get Schedulers",
  options: option.object({
    saveResultJson: option.string.meta({
      layout: {
        label: "Save schedulers list (JSON)",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    options.saveResultJson ? [options.saveResultJson] : [],
});
