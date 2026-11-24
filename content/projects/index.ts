import type { Project } from "@/content/types";
import { project as gaby } from "./gaby";
import { project as inversionesJs } from "./inversiones-js";
import { project as inversionesJl22 } from "./inversionesjl22";
import { project as krea } from "./krea";
import { project as laNacionRadio } from "./la-nacion-radio";
import { project as maranatha } from "./maranatha";
import { project as melao } from "./melao";
import { project as workout } from "./workout";
import { project as worldFlags } from "./world-flags";

/** Every project, in the order they appear on the page. */
export const projects: Project[] = [
  maranatha,
  melao,
  inversionesJs,
  gaby,
  worldFlags,
  workout,
  krea,
  inversionesJl22,
  laNacionRadio,
].sort((a, b) => a.order - b.order);
