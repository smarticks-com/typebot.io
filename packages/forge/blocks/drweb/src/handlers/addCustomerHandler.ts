import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { addCustomer } from "../actions/addCustomer";

export const addCustomerHandler = createActionHandler(addCustomer, {
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
        .post(`${tenantUrl}/CommonAPI/v1/Customer/AddNew`, {
          headers: {
            "Content-Type": "application/json",
            DRWebCommonAPIToken: apiToken,
          },
          json: {
            firstName: options.firstName,
            lastName: options.lastName,
            identity: options.identity,
            phoneNumber: options.phoneNumber,
            mobileNotification: true,
          },
          timeout: 10_000,
        })
        .json<{ Code: number; Error: string | null; Result: unknown }>();

      const result = data.Result as Record<string, unknown> | null;
      const customerId = result?.ID ?? result?.CustomerID;
      if (!customerId)
        throw new Error(data.Error ?? "No customer ID returned");

      if (options.saveIdTo)
        variables.set([
          { id: options.saveIdTo, value: String(customerId) },
        ]);
    } catch (error) {
      logs.add(
        await parseUnknownError({
          err: error,
          context: "While adding DRWeb customer",
        }),
      );
    }
  },
});
