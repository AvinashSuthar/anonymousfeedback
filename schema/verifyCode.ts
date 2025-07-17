import { z } from "zod";

export const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 characters long")
    .regex(/^\d+$/, "Verification code must contain only digits"),
});

export type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;
