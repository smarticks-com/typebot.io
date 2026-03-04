import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { getAppointments } from "../actions/getAppointments";

export const getAppointmentsHandler = createActionHandler(getAppointments, {
  server: async ({
    credentials: { tenantUrl },
    options,
    variables,
    logs,
  }) => {
    if (!tenantUrl) return logs.add("Tenant URL is required");

    const apiToken = options.apiToken
      ? String(variables.get(options.apiToken) ?? "")
      : "";
    if (!apiToken) return logs.add("API token is empty");

    try {
      const data = await ky
        .post(
          `${tenantUrl}/CommonAPI/v1/Appointment/GetLastUpdatedAppointments`,
          {
            headers: {
              "Content-Type": "application/json",
              DRWebCommonAPIToken: apiToken,
            },
            json: { maxResults: options.maxResults ?? 100 },
            timeout: 15_000,
          },
        )
        .json<{ Code: number; Error: string | null; Result: unknown[] | null }>();

      const appts = data.Result ?? [];

      if (options.saveResultsTo)
        variables.set([
          { id: options.saveResultsTo, value: JSON.stringify(appts) },
        ]);
    } catch (error) {
      if (options.saveResultsTo)
        variables.set([{ id: options.saveResultsTo, value: "[]" }]);
      logs.add(
        await parseUnknownError({
          err: error,
          context: "While fetching DRWeb appointments",
        }),
      );
    }
  },
});
