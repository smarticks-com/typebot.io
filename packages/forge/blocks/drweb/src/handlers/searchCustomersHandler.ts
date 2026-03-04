import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { searchCustomers } from "../actions/searchCustomers";

export const searchCustomersHandler = createActionHandler(searchCustomers, {
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
      const body: Record<string, unknown> = {
        maxResults: options.maxResults ?? 10,
      };
      if (options.phone) {
        // Normalize phone: strip +972/972 prefix and add 0
        let phone = options.phone.replace(/\D/g, "");
        if (phone.startsWith("972")) phone = "0" + phone.slice(3);
        if (!phone.startsWith("0")) phone = "0" + phone;
        body.cellPhone = phone;
      }

      const data = await ky
        .post(`${tenantUrl}/CommonAPI/v1/Customer/SearchCustomers`, {
          headers: {
            "Content-Type": "application/json",
            DRWebCommonAPIToken: apiToken,
          },
          json: body,
          timeout: 10_000,
        })
        .json<{ Code: number; Error: string | null; Result: unknown[] | null }>();

      const results = data.Result ?? [];

      if (options.saveResultsTo)
        variables.set([
          { id: options.saveResultsTo, value: JSON.stringify(results) },
        ]);
    } catch (error) {
      if (options.saveResultsTo)
        variables.set([{ id: options.saveResultsTo, value: "[]" }]);
      logs.add(
        await parseUnknownError({
          err: error,
          context: "While searching DRWeb customers",
        }),
      );
    }
  },
});
