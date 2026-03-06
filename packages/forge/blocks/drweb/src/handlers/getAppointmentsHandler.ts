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

      let appts = data.Result as Record<string, unknown>[] ?? [];

      // Filter by customerID if provided
      const filterCustId = options.customerID
        ? Number(options.customerID)
        : null;
      if (filterCustId) {
        appts = appts.filter(
          (a) => Number(a.CustomerID ?? a.customerID) === filterCustId,
        );
      }

      // Filter to future non-cancelled if requested
      if (options.futureOnly === "true") {
        const now = new Date();
        appts = appts.filter((a) => {
          const dt = a.AppointmentDateTime ?? a.appointmentDateTime;
          if (!dt) return false;
          const canceled = a.Canceled ?? a.canceled;
          if (canceled === true) return false;
          return new Date(String(dt)) > now;
        });
      }

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
