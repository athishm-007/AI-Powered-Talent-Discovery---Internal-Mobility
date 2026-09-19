import { ZodSchema } from 'zod';

export interface LLMProvider {
  completeJSON<T>(prompt: string, systemPrompt: string, schema: ZodSchema<T>): Promise<T>;
  streamText(prompt: string, systemPrompt: string, onChunk: (text: string) => void): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
}
