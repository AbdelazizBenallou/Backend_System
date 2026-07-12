import { Router } from "express";
import { roleController } from "./roles.controller.js";
import { verifyAccessToken } from "../../../framework/middleware/verifyAccessToken.js";
import { checkPermission } from "../../../framework/middleware/checkPermission.js";
import { zodValidate } from "../../../framework/middleware/zodValidate.js";
import {
  roleRateLimit,
  permissionRateLimit,
} from "../../../framework/middleware/rateLimiter.js";
import {
  createRoleSchema,
  updateRoleSchema,
  createPermissionSchema,
  updatePermissionSchema,
  assignPermissionSchema,
  assignUserRoleSchema,
} from "./roles.validator.js";

const router = Router();
const permissionRouter = Router();
const userRoleRouter = Router();

router.use(verifyAccessToken, checkPermission("manage_roles"), roleRateLimit);
permissionRouter.use(verifyAccessToken, checkPermission("manage_roles"), permissionRateLimit);
userRoleRouter.use(verifyAccessToken, checkPermission("manage_roles"), roleRateLimit);

// ── Roles ──────────────────────────────────────────────────────

/**
 * @openapi
 * /v1/roles:
 *   get:
 *     tags: [Roles]
 *     summary: List all roles
 *     description: Returns all roles with their permissions and user count.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", roleController.findAll);

/**
 * @openapi
 * /v1/roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     description: Returns a single role with permissions and user count.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.get("/:id", roleController.findById);

/**
 * @openapi
 * /v1/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Role name already exists
 */
router.post("/", zodValidate(createRoleSchema), roleController.create);

/**
 * @openapi
 * /v1/roles/{id}:
 *   patch:
 *     tags: [Roles]
 *     summary: Update a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role name already exists
 */
router.patch("/:id", zodValidate(updateRoleSchema), roleController.update);

/**
 * @openapi
 * /v1/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
 *     description: Cannot delete a role that has users assigned.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       409:
 *         description: Cannot delete role with assigned users
 */
router.delete("/:id", roleController.delete);

// ── Role-Permission assignment ────────────────────────────────

/**
 * @openapi
 * /v1/roles/{id}/permissions:
 *   get:
 *     tags: [Roles]
 *     summary: Get permissions of a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.get("/:id/permissions", roleController.getPermissionsByRoleId);

/**
 * @openapi
 * /v1/roles/{id}/permissions:
 *   post:
 *     tags: [Roles]
 *     summary: Assign a permission to a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permission_id]
 *             properties:
 *               permission_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role or permission not found
 *       409:
 *         description: Permission already assigned to this role
 */
router.post("/:id/permissions", zodValidate(assignPermissionSchema), roleController.addPermissionToRole);

/**
 * @openapi
 * /v1/roles/{id}/permissions/{permissionId}:
 *   delete:
 *     tags: [Roles]
 *     summary: Remove a permission from a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role, permission, or assignment not found
 */
router.delete("/:id/permissions/:permissionId", roleController.removePermissionFromRole);

// ── Role → Users ──────────────────────────────────────────────

/**
 * @openapi
 * /v1/roles/{id}/users:
 *   get:
 *     tags: [Roles]
 *     summary: List users with a specific role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.get("/:id/users", roleController.getUsersByRoleId);

// ── Permission → Roles ───────────────────────────────────────

/**
 * @openapi
 * /v1/permissions/{id}/roles:
 *   get:
 *     tags: [Permissions]
 *     summary: List roles with a specific permission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
permissionRouter.get("/:id/roles", roleController.getRolesByPermissionId);

// ── User → Roles ─────────────────────────────────────────────

/**
 * @openapi
 * /v1/users/{id}/roles:
 *   get:
 *     tags: [Users]
 *     summary: Get roles of a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
userRoleRouter.get("/:id/roles", roleController.getUserRoles);

/**
 * @openapi
 * /v1/users/{id}/roles:
 *   post:
 *     tags: [Users]
 *     summary: Assign a role to a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role_id]
 *             properties:
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or role not found
 *       409:
 *         description: User already has this role
 */
userRoleRouter.post("/:id/roles", zodValidate(assignUserRoleSchema), roleController.assignRoleToUser);

/**
 * @openapi
 * /v1/users/{id}/roles/{roleId}:
 *   delete:
 *     tags: [Users]
 *     summary: Remove a role from a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User, role, or assignment not found
 */
userRoleRouter.delete("/:id/roles/:roleId", roleController.removeRoleFromUser);

// ── Permissions ───────────────────────────────────────────────

/**
 * @openapi
 * /v1/permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: List all permissions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
permissionRouter.get("/", roleController.findAllPermissions);

/**
 * @openapi
 * /v1/permissions/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: Get permission by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
permissionRouter.get("/:id", roleController.findPermissionById);

/**
 * @openapi
 * /v1/permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: Create a new permission
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Permission name already exists
 */
permissionRouter.post("/", zodValidate(createPermissionSchema), roleController.createPermission);

/**
 * @openapi
 * /v1/permissions/{id}:
 *   patch:
 *     tags: [Permissions]
 *     summary: Update a permission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       409:
 *         description: Permission name already exists
 */
permissionRouter.patch("/:id", zodValidate(updatePermissionSchema), roleController.updatePermission);

/**
 * @openapi
 * /v1/permissions/{id}:
 *   delete:
 *     tags: [Permissions]
 *     summary: Delete a permission
 *     description: Cannot delete a permission that is assigned to roles.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       409:
 *         description: Cannot delete permission assigned to roles
 */
permissionRouter.delete("/:id", roleController.deletePermission);

export { router as roleRoutes, permissionRouter as permissionRoutes, userRoleRouter as userRoleRoutes };
