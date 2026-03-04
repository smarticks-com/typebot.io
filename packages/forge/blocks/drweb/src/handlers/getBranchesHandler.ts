import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { getBranches } from "../actions/getBranches";

export const getBranchesHandler = createActionHandler(getBranches, {
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
        .get(`${tenantUrl}/CommonAPI/v1/Business/GetBranches`, {
          headers: {
            DRWebCommonAPIToken: apiToken,
          },
          timeout: 10_000,
        })
        .json<{ Code: number; Error: string | null; Result: unknown[] | null }>();

      const branches = data.Result ?? [];

      if (options.saveResultsTo)
        variables.set([
          { id: options.saveResultsTo, value: JSON.stringify(branches) },
        ]);
    } catch (error) {
      if (options.saveResultsTo)
        variables.set([{ id: options.saveResultsTo, value: "[]" }]);
      logs.add(
        await parseUnknownError({
          err: error,
          context: "While fetching DRWeb branches",
        }),
      );
    }
  },
});
