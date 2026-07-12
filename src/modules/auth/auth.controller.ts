import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { response } from "../../../framework/utils/response.js";
import { hash } from "../../../framework/utils/hash.js";
import { jwtUtils } from "../../../framework/utils/jwt.js";
import { env } from "../../../framework/config/env.js";
import { asyncHandler } from "../../../framework/middleware/asyncHandler.js";
import { refreshTokenRepository } from "./refresh-token.repository.js";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.get("User-Agent") || "unknown";

    const data = await authService.login({ email, password }, ip, userAgent);

    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    response.success(res, data, "Login successful");
  }),

  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password, first_name, last_name } = req.body;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.get("User-Agent") || "unknown";

    const data = await authService.register({ email, password, first_name, last_name }, ip, userAgent);

    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.success(res, data, "Registration successful", 201);
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.refreshPayload!.userId;
    const newAccessToken = await authService.refreshAccessToken(userId);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    response.success(res, { accessToken: newAccessToken }, "Token refreshed");
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body || {};

    if (refreshToken) {
      let payload: { userId: number };
      try {
        payload = jwtUtils.verifyRefreshToken(refreshToken);
      } catch {
        response.error(res, "Invalid refresh token", 403);
        return;
      }

      const storedTokens = await refreshTokenRepository.findValidByUserId(payload.userId);

      for (const t of storedTokens) {
        const match = await hash.verifyToken(t.token, refreshToken).catch(() => false);
        if (match) {
          await refreshTokenRepository.revokeById(t.refresh_token_id);
          break;
        }
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    response.success(res, null, "Logged out successfully");
  }),
};
