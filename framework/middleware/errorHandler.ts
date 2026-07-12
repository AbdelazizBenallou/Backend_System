import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { response } from "../utils/response.js";
import logger from "../config/logger.js";

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    logger.error({ err, path: req.path, method: req.method, statusCode: err.statusCode }, "Application error");
    response.error(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    logger.error({ err, path: req.path, method: req.method }, "Invalid JSON");
    response.error(res, "Invalid JSON in request body", 400);
    return;
  }

  logger.error({ err, path: req.path, method: req.method }, "Unhandled error");
  response.error(res, "Internal server error", 500);
};
