import express from "express";
import {
  handleRegisterItem,
  handleGetAllSeizedGoods,
  handleGetSeizedGoodById,
  handleUpdateSeizedGood,
  handleDeleteSeizedGood,
} from "../controllers/seizedGoodController.js";
import {
  validateCreateSeizedGood,
  validateGetAllSeizedGoods,
  validateDeleteSeizedGood,
  validateGetSeizedGoodById,
  validateUpdateSeizedGood,
} from "../validators/seizedGood.js";

import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import uploadFiles from "../middlewares/uploadFilesMulter.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/seized-goods:
 *   post:
 *     summary: Create a seized good
 *     tags: [Seized Goods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the seized good
 *               description:
 *                 type: string
 *                 description: Description of the seized good
 *               value:
 *                 type: number
 *                 description: Estimated value of the seized good
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the seized good
 *               categoryId:
 *                 type: integer
 *                 description: ID of the category
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images of the seized good
 *     responses:
 *       201:
 *         description: Seized good created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeizedGood'
 *       403:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  isAuthenticated,
  requireRole("ADMIN"),
  uploadFiles.array("files", 5),
  validateCreateSeizedGood,
  handleValidationErrors,
  handleRegisterItem
);

/**
 * @swagger
 * /api/v1/seized-goods:
 *   get:
 *     summary: Get all seized goods
 *     tags: [Seized Goods]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: A list of seized goods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SeizedGood'
 */
router.get(
  "/",
  validateGetAllSeizedGoods,
  handleValidationErrors,
  handleGetAllSeizedGoods
);

/**
 * @swagger
 * /api/v1/seized-goods/{id}:
 *   get:
 *     summary: Get a seized good by ID
 *     tags: [Seized Goods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seized good
 *     responses:
 *       200:
 *         description: Details of the seized good
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeizedGood'
 *       404:
 *         description: Seized good not found
 */
router.get(
  "/:id",
  validateGetSeizedGoodById,
  handleValidationErrors,
  handleGetSeizedGoodById
);

/**
 * @swagger
 * /api/v1/seized-goods/{id}:
 *   put:
 *     summary: Update a seized good by ID
 *     tags: [Seized Goods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seized good to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the seized good
 *               description:
 *                 type: string
 *                 description: Updated description of the seized good
 *               value:
 *                 type: number
 *                 description: Updated estimated value
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity
 *               categoryId:
 *                 type: integer
 *                 description: Updated category ID
 *     responses:
 *       200:
 *         description: Seized good updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeizedGood'
 *       404:
 *         description: Seized good not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  isAuthenticated,
  requireRole("ADMIN"),
  validateUpdateSeizedGood,
  handleValidationErrors,
  handleUpdateSeizedGood
);

/**
 * @swagger
 * /api/v1/seized-goods/{id}:
 *   delete:
 *     summary: Delete a seized good by ID
 *     tags: [Seized Goods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seized good to delete
 *     responses:
 *       204:
 *         description: Seized good deleted successfully
 *       404:
 *         description: Seized good not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  isAuthenticated,
  requireRole("ADMIN"),
  validateDeleteSeizedGood,
  handleValidationErrors,
  handleDeleteSeizedGood
);

export default router;
