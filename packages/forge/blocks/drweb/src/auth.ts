import { createAuth, option } from "@typebot.io/forge";

export const auth = createAuth({
  type: "encryptedCredentials",
  name: "DRWeb account",
  schema: option.object({
    tenantUrl: option.string
      .meta({
        layout: {
          isRequired: true,
          label: "Tenant URL",
          placeholder: "https://your-tenant.drweb.com",
          helperText:
            "The base URL of your DRWeb instance (no trailing slash).",
          withVariableButton: false,
        },
      })
      .transform((value) => value?.replace(/\/$/, "")),
    clientId: option.string.meta({
      layout: {
        isRequired: true,
        label: "Client ID",
        placeholder: "your-client-id",
        withVariableButton: false,
      },
    }),
    clientSecret: option.string.meta({
      layout: {
        isRequired: true,
        label: "Client Secret",
        placeholder: "your-client-secret",
        inputType: "password",
        withVariableButton: false,
      },
    }),
  }),
});
