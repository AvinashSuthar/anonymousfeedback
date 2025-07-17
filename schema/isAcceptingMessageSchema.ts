import { z } from "zod";

export const isAcceptingMessageSchema = z.object({
  isAcceptingMessage: z.boolean(),
});

export type IsAcceptingMessageSchema = z.infer<typeof isAcceptingMessageSchema>;
