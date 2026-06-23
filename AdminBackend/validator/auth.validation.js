import {z} from 'zod'
export const auth_validation = z.object({
    name:z
    .string().min(3,"Name must be at least 3 characters")
    .max(100,"Name cannot exceed 100 characters"),

    email:z
    .string().email('Invalid email address'),

    password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  phone_no: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Invalid phone number").optional(),
})

