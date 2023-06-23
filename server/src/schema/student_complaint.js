import { z } from 'zod'

export const studentCreateComplaintSchema = z.object({
    complaintType: z.enum(["Electrical", "Plumbing", "Hostel", "Other"]),
    complaintDescription: z.string().min(1).max(255),
    complaintDate: z.string().min(1).max(255),
    complaintSeverity: z.enum(["Low", "Medium", "High"]),
})