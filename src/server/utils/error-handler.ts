export type ErrorResponse = {
  error: string;
  status?: number;
};

export class ErrorHandler extends Error {
  status: number;

  constructor(message: string, status: 400 | 401 | 403 | 404 | 500 = 400) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

export function handleError(error: unknown): ErrorResponse {
  if (error instanceof ErrorHandler) {
    return {
      error: error.message,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500,
    };
  }

  return {
    error: "Error desconocido",
    status: 500,
  };
}

export function throwValidationError(message: string): never {
  throw new ErrorHandler(message, 400);
}
