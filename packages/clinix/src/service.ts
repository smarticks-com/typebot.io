// DRWeb Common API client with automatic token renewal
// Config via environment variables: DRWEB_BASE_URL, DRWEB_TOKEN_ID, DRWEB_TOKEN

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

function getConfig() {
  const baseUrl = process.env.DRWEB_BASE_URL;
  const tokenId = process.env.DRWEB_TOKEN_ID;
  const token = process.env.DRWEB_TOKEN;
  if (!baseUrl || !token)
    throw new Error("DRWEB_BASE_URL and DRWEB_TOKEN must be set");
  return { baseUrl: baseUrl.replace(/\/$/, ""), tokenId, token };
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const config = getConfig();

  // If we have a cached token that's expired, try to renew
  if (cachedToken) {
    try {
      const renewed = await renewToken(cachedToken, config.baseUrl);
      if (renewed) return renewed;
    } catch {
      // Fall through to initial token
    }
  }

  // Use the initial token from env
  cachedToken = config.token;
  // Initial tokens expire in 3 days, set expiry to 2 days to be safe
  tokenExpiry = Date.now() + 2 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function renewToken(
  currentToken: string,
  baseUrl: string,
): Promise<string | null> {
  const res = await fetch(
    `${baseUrl}/CommonAPI/v1/Managment/GenerateNewAuthenticationToken`,
    {
      method: "GET",
      headers: { DRWebCommonAPIToken: currentToken },
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    code?: number;
    result?: { token?: string };
  };
  if (data.code !== 0 || !data.result?.token) return null;
  cachedToken = data.result.token;
  // Renewed tokens last 1 month, set expiry to 25 days
  tokenExpiry = Date.now() + 25 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function drwebCall<T>(
  path: string,
  method: "GET" | "POST" | "PUT",
  body?: unknown,
  query?: Record<string, string>,
): Promise<T> {
  const config = getConfig();
  const token = await getToken();

  let url = `${config.baseUrl}${path}`;
  if (query) {
    const params = new URLSearchParams(query);
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      DRWebCommonAPIToken: token,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DRWeb API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as { code?: number; error?: string };
  if (data.code !== undefined && data.code !== 0) {
    throw new Error(`DRWeb API error: ${data.error || `code ${data.code}`}`);
  }

  return data as T;
}

// --- Patient ---

export interface CustomerResult {
  id: number;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  identity: string | null;
  mobile: string | null;
  email: string | null;
  birthDate: string | null;
  active: boolean;
}

export async function searchPatient(params: {
  name?: string;
  phone?: string;
  identity?: string;
  email?: string;
}) {
  const res = await drwebCall<{
    result: CustomerResult[] | null;
    nextPageToken: string | null;
  }>("/CommonAPI/v1/Customer/SearchCustomers", "POST", {
    maxResults: 20,
    name: params.name || null,
    phone: params.phone || null,
    identity: params.identity || null,
    email: params.email || null,
  });
  return res.result || [];
}

export async function getPatient(customerID: number) {
  const res = await drwebCall<{ result: CustomerResult | null }>(
    "/CommonAPI/v1/Customer/GetCustomerByID",
    "GET",
    undefined,
    { customerID: String(customerID) },
  );
  return res.result;
}

export async function registerPatient(data: {
  firstName: string;
  lastName: string;
  identity: string;
  mobile?: string;
  email?: string;
}) {
  const res = await drwebCall<{ result: CustomerResult | null }>(
    "/CommonAPI/v1/Customer/AddNew",
    "POST",
    data,
  );
  return res.result;
}

// --- Appointments ---

export interface FreeSlot {
  schedulerID: number;
  branchID: number;
  from: string;
  to: string;
}

export async function getFreeSlots(params: {
  schedulerID: number;
  branchID: number;
  startDate: string;
  duration: number;
  depthInDays?: number;
  startTime?: string;
  endTime?: string;
}) {
  const res = await drwebCall<{
    result: FreeSlot[] | null;
    nextPageToken: string | null;
  }>("/CommonAPI/v1/Appointment/GetFreeTime", "POST", {
    maxResults: 50,
    schedulerID: params.schedulerID,
    branchID: params.branchID,
    startDate: params.startDate,
    duration: params.duration,
    depthInDays: params.depthInDays ?? 14,
    startTime: params.startTime || null,
    endTime: params.endTime || null,
    weekDays: [true, true, true, true, true, true, true],
  });
  return res.result || [];
}

export async function bookAppointment(data: {
  schedulerID: number;
  branchID: number;
  customerID: number;
  appointmentDateTime: string;
  duration: number;
  priceListID: number;
  priceListCodeID: number;
  remark?: string;
}) {
  const res = await drwebCall<{
    result: { appointmentID: number } | null;
  }>("/CommonAPI/v1/Appointment/AddNew", "POST", data);
  return res.result;
}

export interface AppointmentResult {
  id: number;
  appointmentDateTime: string | null;
  duration: number;
  branchID: number;
  schedulerID: number;
  customerID: number;
  customerFullName: string | null;
  customerIdentity: string | null;
  customerMobile: string | null;
  priceListID: number;
  priceListCodeID: number;
  remark: string | null;
  canceled: boolean;
  arrived: boolean | null;
  paid: boolean;
}

export async function getAppointment(appointmentID: number) {
  const res = await drwebCall<{ result: AppointmentResult | null }>(
    "/CommonAPI/v1/Appointment/GetAppointmentByID",
    "GET",
    undefined,
    { appointmentID: String(appointmentID) },
  );
  return res.result;
}

// --- Reference Data ---

export interface Scheduler {
  id: number;
  name: string | null;
}

export async function getSchedulers() {
  const res = await drwebCall<{
    result: Scheduler[] | null;
    nextPageToken: string | null;
  }>("/CommonAPI/v1/Appointment/GetSchedulersList", "POST", {
    maxResults: 100,
  });
  return res.result || [];
}

export interface Branch {
  id: number;
  name: string | null;
  address: string | null;
  phone1: string | null;
}

export async function getBranches() {
  const res = await drwebCall<{
    result: Branch[] | null;
  }>("/CommonAPI/v1/Business/GetBranches", "GET");
  return res.result || [];
}
