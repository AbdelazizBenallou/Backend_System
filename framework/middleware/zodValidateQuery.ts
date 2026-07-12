import type { Request, Response, NextFunction } from "express";
import { type ZodSchema } from "zod";
import { response } from "../utils/response.js";

export const zodValidateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      response.error(res, messages, 400);
      return;
    }
    Object.defineProperty(req, "query", {
      value: result.data,
      writable: true,
      configurable: true,
    });
    next();
  };
};
