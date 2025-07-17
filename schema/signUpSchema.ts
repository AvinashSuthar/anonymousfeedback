import { z } from "zod";
import { usernameSchema } from "./usernameSchema";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 6 characters long")
    .max(64, "Password must not exceed 64 characters"),
  username: usernameSchema,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
