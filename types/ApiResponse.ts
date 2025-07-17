import { Message } from "@/models/Message";

export interface APIResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
