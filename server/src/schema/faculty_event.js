import { z } from "zod";

export const facultyEventSchema = z.object({
  eventName: z.string().min(5).max(255),
  eventDescription: z.string().min(5).max(255),
  eventPoster: z.string().min(5).max(255),
  eventDate: z.string().min(10).max(255),
  eventTime: z.string().min(5).max(255),
  eventVenue: z.string().min(5).max(255),
  eventOrganiser: z.string().min(5).max(255),
  participantCount: z.number(),
  hostedBy: z.string().min(5).max(255),
});
