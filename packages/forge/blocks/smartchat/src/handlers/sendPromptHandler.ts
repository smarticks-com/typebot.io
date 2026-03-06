import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { sendPrompt } from "../actions/sendPrompt";
import { apiBaseUrl, defaultModel } from "../constants";

export const sendPromptHandler = createActionHandler(sendPrompt, {
  server: async ({ credentials: { apiKey }, options, variables, logs }) => {
    if (!apiKey) return logs.add("OpenAI API key is required");
    if (!options.prompt) return logs.add("User prompt is required");

    const previousResponseId = options.previousResponseId
      ? String(variables.get(options.previousResponseId) ?? "")
      : undefined;

    const body: Record<string, unknown> = {
      model: options.model ?? defaultModel,
      input: options.prompt,
    };

    if (options.instructions) {
      body.instructions = options.instructions;
    }

    if (typeof options.temperature === "number") {
      body.temperature = options.temperature;
    }

    if (previousResponseId) {
      body.previous_response_id = previousResponseId;
    }

    try {
      const data = await ky
        .post(`${apiBaseUrl}/responses`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          json: body,
          timeout: 60_000,
        })
        .json<{
          id: string;
          output: Array<{
            type: string;
            content?: Array<{ type: string; text?: string }>;
          }>;
        }>();

      const text =
        data.output
          ?.find((o) => o.type === "message")
          ?.content?.find((c) => c.type === "output_text")?.text ?? "";

      const setVars: Array<{ id: string; value: string }> = [];

      if (options.saveResponseTo)
        setVars.push({ id: options.saveResponseTo, value: text });

      if (options.saveResponseIdTo)
        setVars.push({ id: options.saveResponseIdTo, value: data.id });

      if (setVars.length) variables.set(setVars);
    } catch (error) {
      logs.add(
        await parseUnknownError({
          err: error,
          context: "While calling OpenAI Responses API",
        }),
      );
    }
  },
});
