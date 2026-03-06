import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { getAppointmentLabels } from "../actions/getAppointmentLabels";

export const getAppointmentLabelsHandler = createActionHandler(
  getAppointmentLabels,
  {
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
            `${tenantUrl}/CommonAPI/v1/Appointment/GetSchedulerEventColorsList`,
            {
              headers: {
                "Content-Type": "application/json",
                DRWebCommonAPIToken: apiToken,
              },
              json: { maxResults: 100 },
              timeout: 10_000,
            },
          )
          .json<{
            Code: number;
            Error: string | null;
            Result: unknown[] | null;
          }>();

        const labels = data.Result ?? [];

        if (options.saveResultsTo)
          variables.set([
            { id: options.saveResultsTo, value: JSON.stringify(labels) },
          ]);
      } catch (error) {
        if (options.saveResultsTo)
          variables.set([{ id: options.saveResultsTo, value: "[]" }]);
        logs.add(
          await parseUnknownError({
            err: error,
            context: "While fetching DRWeb appointment labels",
          }),
        );
      }
    },
  },
);
