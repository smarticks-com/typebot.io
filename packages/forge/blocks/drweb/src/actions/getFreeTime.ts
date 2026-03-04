import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getFreeTime = createAction({
  auth,
  name: "Get Free Time Slots",
  options: option.object({
    apiToken: option.string.meta({
      layout: {
        label: "API Token variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
    schedulerID: option.string.meta({
      layout: {
        label: "Scheduler ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    branchID: option.string.meta({
      layout: {
        label: "Branch ID",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    startDate: option.string.meta({
      layout: {
        label: "Start date (YYYY-MM-DD)",
        withVariableButton: true,
        isRequired: true,
      },
    }),
    duration: option.number.meta({
      layout: {
        label: "Duration (minutes)",
        defaultValue: 15,
      },
    }),
    depthInDays: option.number.meta({
      layout: {
        label: "Search depth (days)",
        defaultValue: 30,
      },
    }),
    saveResultsTo: option.string.meta({
      layout: {
        label: "Save free slots JSON to variable",
        inputType: "variableDropdown",
        isRequired: true,
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResultsTo].filter(isDefined),
});
