import { z } from "zod";
export const pinSchema = z.string().regex(/^\d{4,12}$/, "PIN must be 4–12 digits");
