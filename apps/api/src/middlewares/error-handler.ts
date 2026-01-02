import type { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
};

const isJsonParseError = (error: unknown): error is { type: string } =>
  typeof error === 'object' &&
  error !== null &&
  'type' in error &&
  (error as { type?: string }).type === 'entity.parse.failed';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (isJsonParseError(err)) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
