'use server'

import db from "@platter/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const ComplaintSchema = z.object({
  content: z.string().min(10, {
    message: "Complaint must be at least 10 characters long.",
  }),
  category: z.enum(['FOOD', 'SERVICE', 'CLEANLINESS', 'WAIT_TIME', 'ATMOSPHERE', 'OTHER'], {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  qrCodeId: z.string(),
    userId: z.string(),
  tableId: z.string().optional(),
})

export async function createComplaint(
  qrCodeId: string,
  tableId: string,
  content: string,
  category: string,
  userId: string,
) {
  try {
    const validatedData = ComplaintSchema.parse({
      content,
      category,
      qrCodeId,
      tableId,
      userId,
    })
    console.log(validatedData)
    await db.complaint.create({
      data: {
        ...validatedData,
        status: 'PENDING', // Default status for new complaints
      } as any,
    })

    revalidatePath('/complaints')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return { success: false, error: error.errors }
    }
    console.error('Failed to submit complaint:', error)
    throw new Error("Failed to submit complaint")
  }
}

