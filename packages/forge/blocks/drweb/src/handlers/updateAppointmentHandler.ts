import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { updateAppointment } from "../actions/updateAppointment";

export const updateAppointmentHandler = createActionHandler(
  updateAppointment,
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
        const apptRaw = options.appointmentJson ?? "{}";
        const appt = JSON.parse(apptRaw) as Record<string, unknown>;

        const body: Record<string, unknown> = {
          id: appt.ID ?? appt.id,
          appointmentDateTime: appt.AppointmentDateTime ?? appt.appointmentDateTime,
          duration: appt.Duration ?? appt.duration,
          branchID: appt.BranchID ?? appt.branchID,
          schedulerID: appt.SchedulerID ?? appt.schedulerID,
          customerID: Number(options.customerID),
          priceListID: appt.PriceListID ?? appt.priceListID ?? 1,
          priceListCodeID: appt.PriceListCodeID ?? appt.priceListCodeID ?? 1,
          canceled: true,
          cancelReasonID: options.cancelReasonID ?? 1,
        };

        const data = await ky
          .put(`${tenantUrl}/CommonAPI/v1/Appointment/Update`, {
            headers: {
              "Content-Type": "application/json",
              DRWebCommonAPIToken: apiToken,
            },
            json: body,
            timeout: 10_000,
          })
          .json<{ Code: number; Error: string | null; Result: unknown }>();

        if (data.Code !== 1)
          throw new Error(data.Error ?? "Cancel failed");

        if (options.saveSuccessTo)
          variables.set([{ id: options.saveSuccessTo, value: "true" }]);
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : String(error);
        if (options.saveSuccessTo)
          variables.set([{ id: options.saveSuccessTo, value: "false" }]);
        if (options.saveErrorTo)
          variables.set([{ id: options.saveErrorTo, value: msg }]);
        logs.add(
          await parseUnknownError({
            err: error,
            context: "While cancelling DRWeb appointment",
          }),
        );
      }
    },
  },
);
