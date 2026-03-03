import { createAction, option } from "@typebot.io/forge";
import { auth } from "../auth";

export const getFreeSlots = createAction({
  auth,
  name: "Get Free Slots",
  options: option.object({
    schedulerID: option.string.meta({
      layout: { label: "Scheduler ID", isRequired: true },
    }),
    branchID: option.string.meta({
      layout: { label: "Branch ID", isRequired: true },
    }),
    startDate: option.string.meta({
      layout: {
        label: "Start date",
        isRequired: true,
        helperText: "Format: yyyy-MM-dd (e.g. 2025-01-15)",
      },
    }),
    duration: option.string.meta({
      layout: {
        label: "Duration (minutes)",
        isRequired: true,
        defaultValue: "30",
      },
    }),
    depthInDays: option.string.meta({
      layout: {
        label: "Search depth (days)",
        defaultValue: "14",
        helperText: "Max 60",
      },
    }),
    saveResultJson: option.string.meta({
      layout: {
        label: "Save free slots (JSON)",
        inputType: "variableDropdown",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    options.saveResultJson ? [options.saveResultJson] : [],
});
