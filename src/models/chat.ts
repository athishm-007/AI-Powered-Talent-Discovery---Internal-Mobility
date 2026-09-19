import { z } from 'zod';

export const ChatSourceSchema = z.object({
  type: z.enum(['profile', 'match', 'gap', 'roadmap', 'learning_resource']),
  id: z.string(),
  title: z.string(),
});
export type ChatSource = z.infer<typeof ChatSourceSchema>;

export const ChatMessageSchema = z.object({
  id: z.string().uuid().optional(),
  session_id: z.string().uuid(),
  sender: z.enum(['user', 'assistant']),
  content: z.string(),
  cited_sources: z.array(ChatSourceSchema).default([]),
  created_at: z.string().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatSessionSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  title: z.string(),
  created_at: z.string().optional(),
  messages: z.array(ChatMessageSchema).default([]),
});
export type ChatSession = z.infer<typeof ChatSessionSchema>;

export const SendMessageSchema = z.object({
  session_id: z.string().uuid().optional(),
  message: z.string().min(1, 'Message is required'),
});
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
