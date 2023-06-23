import { z } from "zod";

export const wardenCreateRoomSchema = z.object({
  roomNo: z.string().min(5).max(5),
  roomCapacity: z.enum(["2", "3"]),
  roomType: z.enum(["AC", "NON-AC"]),
});
