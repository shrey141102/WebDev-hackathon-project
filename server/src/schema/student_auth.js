import { z } from "zod";

export const studentAuthRegisterSchema = z.object({
  regNo: z.string().min(9).max(9),
  password: z.string().min(8).max(100),
  name: z.string().min(3).max(100),
  block: z.enum(["A", "B", "C", "D"]),
  roomNo: z.string(),
});

export const studentAuthLoginSchema = z.object({
  regNo: z.string().min(9).max(9),
  password: z.string().min(8).max(100),
});
