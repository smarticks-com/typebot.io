import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { getAppointmentByID } from "../actions/getAppointmentByID";

export const getAppointmentByIDHandler = createActionHandler(
  getAppointmentByID,
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
      if (!options.appointmentID)
        return logs.add("Appointment ID is required");

      try {
        const data = await ky
          .get(
            `${tenantUrl}/CommonAPI/v1/Appointment/GetAppointmentByID?appointmentID=${options.appointmentID}`,
            {
              headers: { DRWebCommonAPIToken: apiToken },
              timeout: 10_000,
            },
          )
          .json<{ Code: number; Error: string | null; Result: unknown }>();

        if (data.Code !== 1)
          throw new Error(data.Error ?? "Appointment not found");

        if (options.saveResultTo)
          variables.set([
            { id: options.saveResultTo, value: JSON.stringify(data.Result) },
          ]);
      } catch (error) {
        if (options.saveResultTo)
          variables.set([{ id: options.saveResultTo, value: "{}" }]);
        logs.add(
          await parseUnknownError({
            err: error,
            context: "While fetching DRWeb appointment by ID",
          }),
        );
      }
    },
  },
);
