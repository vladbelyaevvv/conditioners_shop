import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodType } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    void handler(req, res, next).catch(next);
  };

export function parse<T>(schema: ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new HttpError(400, "Некорректные данные", result.error.flatten());
  }
  return result.data;
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, details: error.details });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({ message: "Некорректные данные", details: error.flatten() });
    return;
  }

  const databaseError = error as { code?: string; constraint?: string };
  if (databaseError.code === "23505") {
    res.status(409).json({ message: "Запись с таким названием уже существует" });
    return;
  }
  if (databaseError.code === "23503") {
    res.status(409).json({ message: "Запись используется и не может быть удалена" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
}
