import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { addAppointment } from "../actions/addAppointment";

export const addAppointmentHandler = createActionHandler(addAppointment, {
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
        .post(`${tenantUrl}/CommonAPI/v1/Appointment/AddNew`, {
          headers: {
            "Content-Type": "application/json",
            DRWebCommonAPIToken: apiToken,
          },
          json: {
            appointmentDateTime: options.appointmentDateTime,
            duration: options.duration ?? 15,
            branchID: Number(options.branchID),
            schedulerID: Number(options.schedulerID),
            customerID: Number(options.customerID),
            priceListID: options.priceListID ?? 1,
            priceListCodeID: options.priceListCodeID ?? 1,
          },
          timeout: 10_000,
        })
        .json<{ Code: number; Error: string | null; Result: unknown }>();

      if (data.Code !== 1)
        throw new Error(data.Error ?? "Failed to add appointment");

      const result = data.Result as Record<string, unknown> | null;
      const id = result?.ID ?? result?.Id;

      if (options.saveAppointmentIdTo && id)
        variables.set([
          { id: options.saveAppointmentIdTo, value: String(id) },
        ]);
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
          context: "While adding DRWeb appointment",
        }),
      );
    }
  },
});
