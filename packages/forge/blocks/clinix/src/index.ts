import { createBlock } from "@typebot.io/forge";
import { bookAppointment } from "./actions/bookAppointment";
import { getBranches } from "./actions/getBranches";
import { getFreeSlots } from "./actions/getFreeSlots";
import { getSchedulers } from "./actions/getSchedulers";
import { registerPatient } from "./actions/registerPatient";
import { searchPatient } from "./actions/searchPatient";
import { auth } from "./auth";
import { ClinixLogo } from "./logo";

export const clinixBlock = createBlock({
  id: "clinix",
  name: "Clinix",
  tags: ["clinic", "crm", "drweb"],
  LightLogo: ClinixLogo,
  auth,
  actions: [
    searchPatient,
    registerPatient,
    getSchedulers,
    getBranches,
    getFreeSlots,
    bookAppointment,
  ],
});
