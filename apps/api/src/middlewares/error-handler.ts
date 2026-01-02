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

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
