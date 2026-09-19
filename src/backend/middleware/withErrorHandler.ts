export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      {
        data: null,
        error: { code: error.code, message: error.message, details: error.details },
        meta: {},
      },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled API Error:', error);
  return Response.json(
    {
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected internal error occurred' },
      meta: {},
    },
    { status: 500 }
  );
}
