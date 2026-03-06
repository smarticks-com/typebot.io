import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { saveCrmTicket } from "../actions/saveCrmTicket";

export const saveCrmTicketHandler = createActionHandler(saveCrmTicket, {
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
      const body: Record<string, unknown> = {
        customerID: Number(options.customerID),
        reasonID: Number(options.reasonID ?? "2"),
        details: options.details ?? "",
        status: Number(options.status ?? "1"),
      };
      if (options.firstName) body.firstName = options.firstName;
      if (options.lastName) body.lastName = options.lastName;
      if (options.phoneNumber) body.phoneNumber = options.phoneNumber;

      const data = await ky
        .post(
          `${tenantUrl}/CommonAPI/v1/Crm/SaveCrmTicketBycustomerID`,
          {
            headers: {
              "Content-Type": "application/json",
              DRWebCommonAPIToken: apiToken,
            },
            json: body,
            timeout: 10_000,
          },
        )
        .json<{
          Code: number;
          Error: string | null;
          Result: { CrmTicketID?: number } | null;
        }>();

      if (data.Code !== 1)
        throw new Error(data.Error ?? "CRM ticket creation failed");

      const ticketId = data.Result?.CrmTicketID;

      if (options.saveTicketIdTo)
        variables.set([
          { id: options.saveTicketIdTo, value: String(ticketId ?? "") },
        ]);
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
          context: "While creating DRWeb CRM ticket",
        }),
      );
    }
  },
});
