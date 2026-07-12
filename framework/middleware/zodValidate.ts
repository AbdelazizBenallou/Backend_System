import type { Request, Response, NextFunction } from "express";
import { type ZodSchema } from "zod";
import { response } from "../utils/response.js";

export const zodValidate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      response.error(res, messages, 400);
      return;
    }
    req.body = result.data;
    next();
  };
};
