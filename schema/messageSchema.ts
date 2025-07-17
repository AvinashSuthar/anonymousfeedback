import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(500, "Content cannot exceed 500 characters"),
});

export type MessageSchema = z.infer<typeof messageSchema>;
