import { z } from "zod";

export const facultyCreateDetails = z.object({
  name: z.string().min(3).max(255),
  empId: z.string().min(5).max(5),
  password: z.string().min(8).max(255),
  isHOD: z.boolean().optional(),
});

export const facultyLoginDetails = z.object({
  empId: z.string().min(5).max(5),
  password: z.string().min(8).max(255),
});
