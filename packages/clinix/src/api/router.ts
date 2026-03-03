import { publicProcedure } from "@typebot.io/config/orpc/viewer/middlewares";
import { z } from "zod";
import {
  bookAppointment,
  getAppointment,
  getBranches,
  getFreeSlots,
  getPatient,
  getSchedulers,
  registerPatient,
  searchPatient,
} from "../service";

export const clinixRouter = {
  searchPatient: publicProcedure
    .route({
      method: "POST",
      path: "/clinix/search-patient",
      summary: "Search patients in DRWeb",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          identity: z.string().optional(),
          email: z.string().optional(),
        }),
      }),
    )
    .output(z.object({ patients: z.array(z.any()) }))
    .handler(async ({ input: { body } }) => {
      const patients = await searchPatient(body);
      return { patients };
    }),

  getPatient: publicProcedure
    .route({
      method: "GET",
      path: "/clinix/patient/{id}",
      summary: "Get patient by ID",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(z.object({ params: z.object({ id: z.coerce.number() }) }))
    .output(z.object({ patient: z.any() }))
    .handler(async ({ input: { params } }) => {
      const patient = await getPatient(params.id);
      return { patient };
    }),

  registerPatient: publicProcedure
    .route({
      method: "POST",
      path: "/clinix/register-patient",
      summary: "Register a new patient in DRWeb",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: z.object({
          firstName: z.string(),
          lastName: z.string(),
          identity: z.string(),
          mobile: z.string().optional(),
          email: z.string().optional(),
        }),
      }),
    )
    .output(z.object({ patient: z.any() }))
    .handler(async ({ input: { body } }) => {
      const patient = await registerPatient(body);
      return { patient };
    }),

  getFreeSlots: publicProcedure
    .route({
      method: "POST",
      path: "/clinix/free-slots",
      summary: "Search available appointment slots",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: z.object({
          schedulerID: z.number(),
          branchID: z.number(),
          startDate: z.string(),
          duration: z.number(),
          depthInDays: z.number().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
        }),
      }),
    )
    .output(z.object({ slots: z.array(z.any()) }))
    .handler(async ({ input: { body } }) => {
      const slots = await getFreeSlots(body);
      return { slots };
    }),

  bookAppointment: publicProcedure
    .route({
      method: "POST",
      path: "/clinix/book-appointment",
      summary: "Book an appointment",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(
      z.object({
        body: z.object({
          schedulerID: z.number(),
          branchID: z.number(),
          customerID: z.number(),
          appointmentDateTime: z.string(),
          duration: z.number(),
          priceListID: z.number(),
          priceListCodeID: z.number(),
          remark: z.string().optional(),
        }),
      }),
    )
    .output(z.object({ appointment: z.any() }))
    .handler(async ({ input: { body } }) => {
      const appointment = await bookAppointment(body);
      return { appointment };
    }),

  getAppointment: publicProcedure
    .route({
      method: "GET",
      path: "/clinix/appointment/{id}",
      summary: "Get appointment by ID",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(z.object({ params: z.object({ id: z.coerce.number() }) }))
    .output(z.object({ appointment: z.any() }))
    .handler(async ({ input: { params } }) => {
      const appointment = await getAppointment(params.id);
      return { appointment };
    }),

  getSchedulers: publicProcedure
    .route({
      method: "GET",
      path: "/clinix/schedulers",
      summary: "List doctors/schedulers",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(z.object({}))
    .output(z.object({ schedulers: z.array(z.any()) }))
    .handler(async () => {
      const schedulers = await getSchedulers();
      return { schedulers };
    }),

  getBranches: publicProcedure
    .route({
      method: "GET",
      path: "/clinix/branches",
      summary: "List clinic branches",
      tags: ["Clinix"],
      inputStructure: "detailed",
    })
    .input(z.object({}))
    .output(z.object({ branches: z.array(z.any()) }))
    .handler(async () => {
      const branches = await getBranches();
      return { branches };
    }),
};
