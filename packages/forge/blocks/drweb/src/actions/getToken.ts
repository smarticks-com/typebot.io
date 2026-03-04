import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const getToken = createAction({
  auth,
  name: "Get / Refresh Token",
  options: option.object({
    saveTokenTo: option.string.meta({
      layout: {
        isRequired: true,
        label: "Save token to variable",
        inputType: "variableDropdown",
        helperText: "Store the bearer token here (e.g. api_token)",
      },
    }),
    saveExpiresAtTo: option.string.meta({
      layout: {
        isRequired: true,
        label: "Save expiry (Unix ts) to variable",
        inputType: "variableDropdown",
        helperText: "Store token_expires_at here",
      },
    }),
  }),
  getSetVariableIds: (options) =>
    [options.saveTokenTo, options.saveExpiresAtTo].filter(isDefined),
});
