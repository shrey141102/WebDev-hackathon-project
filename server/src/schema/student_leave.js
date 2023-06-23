import { z } from "zod";

export const studentCreateLeaveSchema = z.object({
  leaveType: z.string().min(1).max(255),
  leaveDate: z.string().min(1).max(255),
  leaveTime: z.string().min(1).max(255),
  leaveDuration: z.string().min(1).max(255),
});
