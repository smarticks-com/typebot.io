import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";
import { defaultModel, models } from "../constants";

export const sendPrompt = createAction({
  auth,
  name: "Send prompt",
  options: option.object({
    model: option.enum(models).meta({
      layout: {
        label: "Model",
        defaultValue: defaultModel,
        direction: "row",
      },
    }),
    instructions: option.string.meta({
      layout: {
        label: "Instructions (system prompt)",
        placeholder: "You are a helpful assistant that responds in Hebrew...",
        inputType: "textarea",
        helperText:
          "Shared instructions for the model. Equivalent to a system message.",
      },
    }),
    prompt: option.string.meta({
      layout: {
        isRequired: true,
        label: "User prompt",
        placeholder: "{{user_message}}",
        inputType: "textarea",
        withVariableButton: true,
      },
    }),
    temperature: option.number.meta({
      layout: {
        label: "Temperature",
        defaultValue: 0,
        helperText: "0 = deterministic, 1 = creative",
      },
    }),
    previousResponseId: option.string.meta({
      layout: {
        label: "Previous response ID (variable)",
        inputType: "variableDropdown",
        helperText:
          "Pass a previous response_id for multi-turn conversations.",
      },
    }),
    saveResponseTo: option.string.meta({
      layout: {
        isRequired: true,
        label: "Save response text to variable",
        inputType: "variableDropdown",
      },
    }),
    saveResponseIdTo: option.string.meta({
      layout: {
        label: "Save response ID to variable",
        inputType: "variableDropdown",
        helperText: "Store response_id for multi-turn follow-ups.",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveResponseTo, options.saveResponseIdTo].filter(isDefined),
});
