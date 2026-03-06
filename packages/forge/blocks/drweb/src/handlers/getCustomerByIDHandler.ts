import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { getCustomerByID } from "../actions/getCustomerByID";

export const getCustomerByIDHandler = createActionHandler(getCustomerByID, {
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
    if (!options.customerID) return logs.add("Customer ID is required");

    try {
      const data = await ky
        .get(
          `${tenantUrl}/CommonAPI/v1/Customer/GetCustomerByID?customerID=${options.customerID}`,
          {
            headers: { DRWebCommonAPIToken: apiToken },
            timeout: 10_000,
          },
        )
        .json<{ Code: number; Error: string | null; Result: unknown }>();

      if (data.Code !== 1)
        throw new Error(data.Error ?? "Customer not found");

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
          context: "While fetching DRWeb customer by ID",
        }),
      );
    }
  },
});
