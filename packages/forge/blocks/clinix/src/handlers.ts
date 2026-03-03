import { createActionHandler } from "@typebot.io/forge";
import { bookAppointment } from "./actions/bookAppointment";
import { getBranches } from "./actions/getBranches";
import { getFreeSlots } from "./actions/getFreeSlots";
import { getSchedulers } from "./actions/getSchedulers";
import { registerPatient } from "./actions/registerPatient";
import { searchPatient } from "./actions/searchPatient";

async function drwebCall(
  baseUrl: string | undefined,
  apiToken: string | undefined,
  path: string,
  method: "GET" | "POST",
  body?: unknown,
  query?: Record<string, string>,
) {
  if (!baseUrl || !apiToken)
    throw new Error("DRWeb credentials not configured");
  let url = `${baseUrl.replace(/\/$/, "")}${path}`;
  if (query) url += `?${new URLSearchParams(query).toString()}`;

  const res = await fetch(url, {
    method,
    headers: {
      DRWebCommonAPIToken: apiToken,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DRWeb ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    code?: number;
    error?: string;
    result?: unknown;
  };
  if (data.code !== undefined && data.code !== 0)
    throw new Error(data.error || `DRWeb error code ${data.code}`);

  return data;
}

export default [
  createActionHandler(searchPatient, {
    server: async ({ credentials, options, variables, logs }) => {
      try {
        if (!options.phone && !options.name && !options.identity)
          return logs.add("Provide at least one of: phone, name, or identity");

        const data = await drwebCall(
          credentials.baseUrl,
          credentials.apiToken,
          "/CommonAPI/v1/Customer/SearchCustomers",
          "POST",
          {
            maxResults: 20,
            phone: options.phone || null,
            name: options.name || null,
            identity: options.identity || null,
          },
        );

        const patients = (data.result as any[]) || [];
        const first = patients[0];

        const vars: { id: string; value: unknown }[] = [];
        if (options.saveResultId && first)
          vars.push({ id: options.saveResultId, value: String(first.id) });
        if (options.saveResultName && first)
          vars.push({ id: options.saveResultName, value: first.name });
        if (options.saveResultJson)
          vars.push({
            id: options.saveResultJson,
            value: JSON.stringify(patients),
          });
        if (vars.length) variables.set(vars);
      } catch (error) {
        logs.add({
          status: "error",
          description: "Search patient failed",
          details: String(error),
        });
      }
    },
  }),

  createActionHandler(registerPatient, {
    server: async ({ credentials, options, variables, logs }) => {
      try {
        if (!options.firstName || !options.lastName || !options.identity)
          return logs.add("First name, last name, and identity are required");

        const data = await drwebCall(
          credentials.baseUrl,
          credentials.apiToken,
          "/CommonAPI/v1/Customer/AddNew",
          "POST",
          {
            firstName: options.firstName,
            lastName: options.lastName,
            identity: options.identity,
            mobile: options.mobile || null,
            email: options.email || null,
          },
        );

        const result = data.result as { id?: number } | null;
        if (options.saveCustomerId && result?.id)
          variables.set([
            { id: options.saveCustomerId, value: String(result.id) },
          ]);
      } catch (error) {
        logs.add({
          status: "error",
          description: "Register patient failed",
          details: String(error),
        });
      }
    },
  }),

  createActionHandler(getSchedulers, {
    server: async ({ credentials, options, variables, logs }) => {
      try {
        const data = await drwebCall(
          credentials.baseUrl,
          credentials.apiToken,
          "/CommonAPI/v1/Appointment/GetSchedulersList",
          "POST",
          { maxResults: 100 },
        );

        if (options.saveResultJson)
          variables.set([
            {
              id: options.saveResultJson,
              value: JSON.stringify(data.result || []),
            },
          ]);
      } catch (error) {
        logs.add({
          status: "error",
          description: "Get schedulers failed",
          details: String(error),
        });
      }
    },
  }),

  createActionHandler(getBranches, {
    server: async ({ credentials, options, variables, logs }) => {
      try {
        const data = await drwebCall(
          credentials.baseUrl,
          credentials.apiToken,
          "/CommonAPI/v1/Business/GetBranches",
          "GET",
        );

        if (options.saveResultJson)
          variables.set([
            {
              id: options.saveResultJson,
              value: JSON.stringify(data.result || []),
            },
          ]);
      } catch (error) {
        logs.add({
          status: "error",
          description: "Get branches failed",
          details: String(error),
        });
      }
    },
  }),

  createActionHandler(getFreeSlots, {
    server: async ({ credentials, options, variables, logs }) => {
      try {
        if (!options.schedulerID || !options.branchID || !options.startDate)
          return logs.add(
            "Scheduler ID, branch ID, and start date are required",
          );

        const data = await drwebCall(
          credentials.baseUrl,
          credentials.apiToken,
          "/CommonAPI/v1/Appointment/GetFreeTime",
          "POST",
          {
            maxResults: 50,
            schedulerID: Number(options.schedulerID),
            branchID: Number(options.branchID),
            startDate: options.startDate,
            duration: Number(options.duration) || 30,
            depthInDays: Number(options.depthInDays) || 14,
            weekDays: [true, true, true, true, true, true, true],
          },
        );

        if (options.saveResultJson)
          variables.set([
            {
              id: options.saveResultJson,
              value: JSON.stringify(data.result || []),
            },
          ]);
      } catch (error) {
        logs.add({
          status: "error",
          description: "Get free slots failed",
          details: String(error),
        });
      }
    },
  }),

  createActionHandler(bookAppointment, {
    server: async ({ credentials, options, variables, logs }) => {
      try {
        if (
          !options.schedulerID ||
          !options.branchID ||
          !options.customerID ||
          !options.appointmentDateTime
        )
          return logs.add(
            "Scheduler ID, branch ID, customer ID, and date/time are required",
          );

        const data = await drwebCall(
          credentials.baseUrl,
          credentials.apiToken,
          "/CommonAPI/v1/Appointment/AddNew",
          "POST",
          {
            schedulerID: Number(options.schedulerID),
            branchID: Number(options.branchID),
            customerID: Number(options.customerID),
            appointmentDateTime: options.appointmentDateTime,
            duration: Number(options.duration) || 30,
            priceListID: Number(options.priceListID),
            priceListCodeID: Number(options.priceListCodeID),
            remark: options.remark || null,
          },
        );

        const result = data.result as { appointmentID?: number } | null;
        if (options.saveAppointmentId && result?.appointmentID)
          variables.set([
            {
              id: options.saveAppointmentId,
              value: String(result.appointmentID),
            },
          ]);
      } catch (error) {
        logs.add({
          status: "error",
          description: "Book appointment failed",
          details: String(error),
        });
      }
    },
  }),
];
