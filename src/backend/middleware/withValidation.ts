import { ZodSchema } from 'zod';

export async function validateRequestBody<T>(req: Request, schema: ZodSchema<T>): Promise<{ data: T | null; errorResponse?: Response }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return {
        data: null,
        errorResponse: Response.json(
          {
            data: null,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request payload',
              details: result.error.flatten().fieldErrors,
            },
            meta: {},
          },
          { status: 400 }
        ),
      };
    }
    return { data: result.data };
  } catch {
    return {
      data: null,
      errorResponse: Response.json(
        { data: null, error: { code: 'INVALID_JSON', message: 'Malformed JSON payload' }, meta: {} },
        { status: 400 }
      ),
    };
  }
}
