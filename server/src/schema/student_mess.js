import { z } from 'zod'

export const studentChangeMessSchema = z.object({
    messType: z.enum(["Veg", "Non Veg", "Special"]),
})