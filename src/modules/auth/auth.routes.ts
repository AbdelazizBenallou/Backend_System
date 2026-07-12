import { Router } from "express";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema, refreshTokenSchema } from "./auth.validator.js";
import { verifyRefreshToken } from "../../../framework/middleware/verifyRefreshToken.js";
import { zodValidate } from "../../../framework/middleware/zodValidate.js";
import {
  loginRateLimit,
  loginEmailRateLimit,
  registerRateLimit,
  refreshTokenRateLimit,
  logoutRateLimit,
} from "../../../framework/middleware/rateLimiter.js";

const router = Router();

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  loginRateLimit,
  loginEmailRateLimit,
  zodValidate(loginSchema),
  authController.login
);

/**
 * @openapi
 * /v1/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, first_name, last_name]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already exists
 */
router.post(
  "/register",
  registerRateLimit,
  zodValidate(registerSchema),
  authController.register
);

/**
 * @openapi
 * /v1/auth/refresh-token:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       403:
 *         description: Invalid refresh token
 */
router.post(
  "/refresh-token",
  refreshTokenRateLimit,
  zodValidate(refreshTokenSchema),
  verifyRefreshToken,
  authController.refreshToken
);

/**
 * @openapi
 * /v1/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", logoutRateLimit, authController.logout);

export default router;
