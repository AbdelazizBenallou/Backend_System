import type { Request, Response, NextFunction } from "express";

export const originCheck = (_req: Request, _res: Response, next: NextFunction): void => next();
