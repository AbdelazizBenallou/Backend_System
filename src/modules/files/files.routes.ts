import { Router } from "express";
import { filesController } from "./files.controller.js";
import { verifyAccessToken } from "../../../framework/middleware/verifyAccessToken.js";
import { checkPermission } from "../../../framework/middleware/checkPermission.js";
import { uploadBatch } from "../../../framework/middleware/upload.js";
import { uploadRateLimit } from "../../../framework/middleware/rateLimiter.js";
import { handleMulterError } from "../../../framework/middleware/uploadErrorHandler.js";

const router = Router();

router.use(verifyAccessToken, checkPermission("manage_files"));

/**
 * @openapi
 * /v1/files/upload:
 *   post:
 *     tags: [Files]
 *     summary: Upload files
 *     description: Upload 1 to 20 files at once (max 20MB each). Video limited to 1 file per upload.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [avatar, document, video, other]
 *           default: other
 *         description: File category
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 20 files (1 for video)
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *       400:
 *         description: Invalid category or no files
 *       413:
 *         description: File too large
 */
router.post(
  "/upload",
  uploadRateLimit,
  (req, res, next) => {
    uploadBatch.array("files", 20)(req, res, (err) => handleMulterError(err, req, res, next));
  },
  filesController.upload,
);

/**
 * @openapi
 * /v1/files:
 *   get:
 *     tags: [Files]
 *     summary: List my files
 *     description: Returns all files uploaded by the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Files fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", filesController.list);

/**
 * @openapi
 * /v1/files/{id}:
 *   get:
 *     tags: [Files]
 *     summary: Get file metadata
 *     description: Returns metadata for a specific file. Users can only access their own files.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       200:
 *         description: File fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: File not found
 */
router.get("/:id", filesController.getById);

/**
 * @openapi
 * /v1/files/{id}/download:
 *   get:
 *     tags: [Files]
 *     summary: Download or preview a file
 *     description: Streams the file with proper Content-Type. Use ?disposition=attachment to force download.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *       - in: query
 *         name: disposition
 *         schema:
 *           type: string
 *           enum: [inline, attachment]
 *           default: inline
 *         description: inline shows in browser, attachment forces download
 *     responses:
 *       200:
 *         description: File stream
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: File not found
 */
router.get("/:id/download", filesController.download);

/**
 * @openapi
 * /v1/files/{id}:
 *   delete:
 *     tags: [Files]
 *     summary: Delete a file
 *     description: Deletes a file from disk and database. Users can only delete their own files.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: File not found
 */
router.delete("/:id", filesController.remove);

export default router;
