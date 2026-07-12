import type { Request, Response, NextFunction } from "express";
import { cache } from "../utils/cache.js";
import prisma from "../config/prisma.js";
import { response } from "../utils/response.js";

export const checkPermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.userId) {
        response.error(res, "Unauthorized", 401);
        return;
      }

      const userId = req.user.userId;
      const cacheKey = `permissions:user:${userId}`;

      let permissions = await cache.get<string[]>(cacheKey);

      if (!permissions) {
        const userRoles = await prisma.userRole.findMany({
          where: { user_id: userId },
          include: {
            role: {
              include: {
                role_permission: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        permissions = userRoles.flatMap((ur) =>
          ur.role.role_permission.map((rp) => rp.permission.name)
        );

        await cache.set(cacheKey, permissions, 60);
      }

      if (!permissions.includes(permissionName)) {
        response.error(res, "Forbidden", 403);
        return;
      }

      next();
    } catch (err) {
      response.error(res, "Permission check failed", 500);
    }
  };
};
