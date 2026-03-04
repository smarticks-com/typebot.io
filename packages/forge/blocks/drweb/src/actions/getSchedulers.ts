import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getSchedulers = createAction({
  auth,
  name: "Get Schedulers List",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
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
        label: "Save schedulers JSON to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultsTo].filter(isDefined),
});
