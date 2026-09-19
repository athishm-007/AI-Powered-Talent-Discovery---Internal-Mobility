import { LLMProvider } from './llm_provider';
import { FallbackProvider } from './fallback_provider';
import { ZodSchema } from 'zod';

export class OpenAIProvider implements LLMProvider {
  private fallback: FallbackProvider;
  private apiKey?: string;

  constructor() {
    this.fallback = new FallbackProvider();
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async completeJSON<T>(prompt: string, systemPrompt: string, schema: ZodSchema<T>): Promise<T> {
    if (!this.apiKey) {
      return this.fallback.completeJSON(prompt, systemPrompt, schema);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API HTTP error: ${response.status}`);
      }

      const json = await response.json();
      const content = json.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content);
      return schema.parse(parsed);
    } catch (err) {
      console.warn('⚠️ OpenAI Provider call failed, falling back to FallbackProvider:', err);
      return this.fallback.completeJSON(prompt, systemPrompt, schema);
    }
  }

  async streamText(prompt: string, systemPrompt: string, onChunk: (text: string) => void): Promise<string> {
    if (!this.apiKey) {
      return this.fallback.streamText(prompt, systemPrompt, onChunk);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          stream: false,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const json = await response.json();
      const text = json.choices[0]?.message?.content || '';
      onChunk(text);
      return text;
    } catch (err) {
      console.warn('⚠️ OpenAI stream call failed, falling back:', err);
      return this.fallback.streamText(prompt, systemPrompt, onChunk);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      return this.fallback.generateEmbedding(text);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI embedding error: ${response.status}`);
      }

      const json = await response.json();
      return json.data[0]?.embedding || this.fallback.generateEmbedding(text);
    } catch (err) {
      console.warn('⚠️ OpenAI embedding call failed, falling back:', err);
      return this.fallback.generateEmbedding(text);
    }
  }
}

export function getLLMProvider(): LLMProvider {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }
  return new FallbackProvider();
}
