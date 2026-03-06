import { createAuth, option } from "@typebot.io/forge";

export const auth = createAuth({
  type: "encryptedCredentials",
  name: "OpenAI account",
  schema: option.object({
    apiKey: option.string.meta({
      layout: {
        isRequired: true,
        label: "API key",
        placeholder: "sk-...",
        inputType: "password",
        helperText:
          "Your OpenAI API key for the Responses API.",
        withVariableButton: false,
        isDebounceDisabled: true,
      },
    }),
  }),
});
