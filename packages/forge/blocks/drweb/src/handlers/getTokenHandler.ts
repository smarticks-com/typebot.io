import { createActionHandler } from "@typebot.io/forge";
import { getToken } from "../actions/getToken";

export const getTokenHandler = createActionHandler(getToken, {
  server: async ({
    credentials: { clientSecret },
    options,
    variables,
    logs,
  }) => {
    if (!clientSecret) return logs.add("API Token is required");

    // DRWeb uses a static API token (stored as clientSecret in credentials).
    // No token exchange endpoint needed — just pass it through.
    if (options.saveTokenTo)
      variables.set([{ id: options.saveTokenTo, value: clientSecret }]);
    if (options.saveExpiresAtTo) {
      // Set expiry far in the future (token doesn't expire unless rotated)
      const farFuture = String(Math.floor(Date.now() / 1000) + 86400 * 365);
      variables.set([{ id: options.saveExpiresAtTo, value: farFuture }]);
    }
  },
});
