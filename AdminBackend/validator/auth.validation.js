import {z} from 'zod'

export const registerValidator = z.object({
    username: z
    .string()
    .min(3,'Username must be at least 3 characters')
    .max(50,'Username too long'),

    email: z .string() .email("Invalid email format"),

    password: z
    .string()
    .min(6,'Password too short')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
})