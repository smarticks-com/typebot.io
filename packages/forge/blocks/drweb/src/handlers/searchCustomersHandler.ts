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
      const maxResults = options.maxResults ?? 10;
      let phone = "";
      if (options.phone) {
        phone = options.phone.replace(/\D/g, "");
        if (phone.startsWith("972")) phone = "0" + phone.slice(3);
        if (!phone.startsWith("0")) phone = "0" + phone;
      }

      const url = `${tenantUrl}/CommonAPI/v1/Customer/SearchCustomers`;
      const headers = {
        "Content-Type": "application/json",
        DRWebCommonAPIToken: apiToken,
      };

      // Try with phone filter first (matches Phone/landline field)
      let data = await ky
        .post(url, {
          headers,
          json: phone ? { phone, maxResults } : { maxResults },
          timeout: 10_000,
        })
        .json<{ Code: number; Error: string | null; Result: unknown[] | null }>();

      let results = data.Result ?? [];

      // If no results, number may be in Mobile field — retry without filter
      if (results.length === 0 && phone) {
        data = await ky
          .post(url, {
            headers,
            json: { maxResults },
            timeout: 10_000,
          })
          .json<{ Code: number; Error: string | null; Result: unknown[] | null }>();
        results = data.Result ?? [];
      }

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
