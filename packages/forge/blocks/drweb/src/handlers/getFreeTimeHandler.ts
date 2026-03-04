import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { getFreeTime } from "../actions/getFreeTime";

export const getFreeTimeHandler = createActionHandler(getFreeTime, {
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
        .post(`${tenantUrl}/CommonAPI/v1/Appointment/GetFreeTime`, {
          headers: {
            "Content-Type": "application/json",
            DRWebCommonAPIToken: apiToken,
          },
          json: {
            schedulerID: Number(options.schedulerID),
            branchID: Number(options.branchID),
            startDate: options.startDate,
            duration: options.duration ?? 15,
            depthInDays: options.depthInDays ?? 30,
            weekDays: [true, true, true, true, true, true, false],
          },
          timeout: 15_000,
        })
        .json<{ Code: number; Error: string | null; Result: unknown[] | null }>();

      const slots = data.Result ?? [];

      if (options.saveResultsTo)
        variables.set([
          { id: options.saveResultsTo, value: JSON.stringify(slots) },
        ]);
    } catch (error) {
      if (options.saveResultsTo)
        variables.set([{ id: options.saveResultsTo, value: "[]" }]);
      logs.add(
        await parseUnknownError({
          err: error,
          context: "While fetching DRWeb free time slots",
        }),
      );
    }
  },
});
