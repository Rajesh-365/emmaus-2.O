import { z } from "zod";

/**
 * Client + server validation schema for the /apply form. The `course` field
 * is validated as a slug string here; existence against the live course list
 * is checked server-side in the API route (since courses live in the DB).
 */

export const applySchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(80),
  lastName: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  dateOfBirth: z.string().trim().min(1, "Required"),
  gender: z.enum(["male", "female"]),
  address: z.string().trim().min(1, "Required").max(500),
  city: z.string().trim().min(1, "Required").max(80),
  state: z.string().trim().min(1, "Required").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit PIN"),
  course: z
    .string()
    .trim()
    .min(1, "Select a programme")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Invalid course"),
  previousEducation: z.enum(["10th", "12th", "diploma", "bachelor", "master", "other"]),
  churchAffiliation: z.string().trim().min(1, "Required").max(160),
  pastorReference: z.string().trim().min(1, "Required").max(160),
  testimony: z.string().trim().min(20, "Share at least a few sentences").max(2000),
  motivation: z.string().trim().min(20, "Share at least a few sentences").max(2000),
});

export type ApplyInput = z.infer<typeof applySchema>;
