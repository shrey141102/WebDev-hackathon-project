import { z } from "zod";

export const wardenAuthLoginSchema = z.object({
  block: z.enum(["A", "B", "C", "D"]),
  password: z.string().min(8).max(100),
});
