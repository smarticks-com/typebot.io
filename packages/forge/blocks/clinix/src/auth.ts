import { createAuth, option } from "@typebot.io/forge";

export const auth = createAuth({
  type: "encryptedCredentials",
  name: "DRWeb account",
  schema: option.object({
    baseUrl: option.string.meta({
      layout: {
        label: "Base URL",
        isRequired: true,
        helperText: "Your DRWeb API base URL (e.g. https://clinic.drweb.co.il)",
        withVariableButton: false,
      },
    }),
    apiToken: option.string.meta({
      layout: {
        label: "API Token",
        isRequired: true,
        inputType: "password",
        helperText: "DRWeb Common API token from Super User settings",
        withVariableButton: false,
      },
    }),
  }),
});
