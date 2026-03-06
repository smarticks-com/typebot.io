import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { addCrmTicketAction } from "../actions/addCrmTicketAction";

export const addCrmTicketActionHandler = createActionHandler(
  addCrmTicketAction,
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
      if (!options.customerID) return logs.add("Customer ID is required");

      try {
        const data = await ky
          .post(
            `${tenantUrl}/CommonAPI/v1/Crm/AddCrmTicketActionByCustomerID`,
            {
              headers: {
                "Content-Type": "application/json",
                DRWebCommonAPIToken: apiToken,
              },
              json: {
                customerID: Number(options.customerID),
                actionTypeID: Number(options.actionTypeID ?? "1"),
                description: options.description ?? "",
              },
              timeout: 10_000,
            },
          )
          .json<{ Code: number; Error: string | null }>();

        if (data.Code !== 1)
          throw new Error(data.Error ?? "Add CRM action failed");

        if (options.saveSuccessTo)
          variables.set([{ id: options.saveSuccessTo, value: "true" }]);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (options.saveSuccessTo)
          variables.set([{ id: options.saveSuccessTo, value: "false" }]);
        if (options.saveErrorTo)
          variables.set([{ id: options.saveErrorTo, value: msg }]);
        logs.add(
          await parseUnknownError({
            err: error,
            context: "While adding DRWeb CRM ticket action",
          }),
        );
      }
    },
  },
);
