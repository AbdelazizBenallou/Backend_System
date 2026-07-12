import { Router } from "express";
import { usersController } from "./users.controller.js";
import { verifyAccessToken } from "../../../framework/middleware/verifyAccessToken.js";
import { checkPermission } from "../../../framework/middleware/checkPermission.js";
import { zodValidate } from "../../../framework/middleware/zodValidate.js";
import { zodValidateQuery } from "../../../framework/middleware/zodValidateQuery.js";
import { listUsersSchema, updateUserSchema } from "./users.validator.js";
import {
  listUsersRateLimit,
  getUserRateLimit,
  updateUserRateLimit,
  deleteUserRateLimit,
} from "../../../framework/middleware/rateLimiter.js";

const router = Router();

router.use(verifyAccessToken, checkPermission("manage_users"));

/**
 * @openapi
 * /v1/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     description: Returns a paginated list of users. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users per page (1-100)
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get(
  "/",
  listUsersRateLimit,
  zodValidateQuery(listUsersSchema),
  usersController.getAll
);

/**
 * @openapi
 * /v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Returns a single user by their ID. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 */
router.get("/:id", getUserRateLimit, usersController.getById);

/**
 * @openapi
 * /v1/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user
 *     description: Updates a user's status and/or profile. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, locked, suspended]
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id",
  updateUserRateLimit,
  zodValidate(updateUserSchema),
  usersController.update
);

/**
 * @openapi
 * /v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     description: Permanently deletes a user by ID. Requires Admin role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUserRateLimit, usersController.remove);

export default router;
