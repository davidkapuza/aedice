import { ChatZodSchema } from "../schemas/chat";

export type TypeLastMessage = {
  last_message: string;
  last_message_time: number;
};

export type TypeUser = z.infer<typeof UserZodSchema>;
export type ChatEntity = z.infer<typeof ChatZodSchema>;
export type TypeMessage = z.infer<typeof MessageZodSchema>
