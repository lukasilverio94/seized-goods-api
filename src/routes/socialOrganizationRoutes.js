import express from "express";
import {
  createSocialOrganizationWithUser,
  createSocialOrganization,
  deleteSocialOrganization,
  getAllSocialOrganizations,
  getSocialOrganizationById,
  updateSocialOrganization,
} from "../controllers/socialOrganizationController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/organizations/register:
 *   post:
 *     summary: Create Social Organization And User
 *     tags: [Social Organizations]
 *     description: Create Social Organization And User relate to the Organization.
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Social Organization's Name
 *                   firstName:
 *                     type: string
 *                     description: User's First name
 *                   lastName:
 *                     type: string
 *                     description: User's Last name
 *                   contactPerson:
 *                     type: string
 *                     description: Contact Name's Person for the Social Organization
 *                   email:
 *                     type: string
 *                     description: Email from Social Organization
 *                   phone:
 *                     type: string
 *                     description: Social Organization's Phone Number
 *                   category:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Expect's category/categories by ID
 *                   streetName:
 *                     type: string
 *                     description: Social Organization's Street's Name
 *                   number:
 *                     type: string
 *                     description: Social Organization's Address Number
 *                   city:
 *                     type: string
 *                     description: Social Organization's City
 *                   country:
 *                     type: string
 *                     description: Social Organization's Country
 *                   zipCode:
 *                     type: string
 *                     description: Social Organization's Zip Code
 *                   qualitifications:
 *                     type: string
 *                     description: What are the qualifications of the Social Organization
 *                   password:
 *                     type: string
 *                     description: User's Password (min 8 characters).
 */
router.post("/register", createSocialOrganizationWithUser);

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     summary: Create Social Organization Only
 *     tags: [Social Organizations]
 *     description: Create Social Organization Only (No User Associated this request)
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Social Organization's Name *
 *                   contactPerson:
 *                     type: string
 *                     description: Contact Name's Person for the Social Organization
 *                   email:
 *                     type: string
 *                     description: Email from Social Organization
 *                   phone:
 *                     type: string
 *                     description: Social Organization's Phone Number
 *                   category:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Expect's category/categories by ID
 *                   streetName:
 *                     type: string
 *                     description: Social Organization's Street's Name
 *                   number:
 *                     type: string
 *                     description: Social Organization's Address Number
 *                   city:
 *                     type: string
 *                     description: Social Organization's City
 *                   country:
 *                     type: string
 *                     description: Social Organization's Country
 *                   zipCode:
 *                     type: string
 *                     description: Social Organization's Zip Code
 *                   qualitifications:
 *                     type: string
 *                     description: What are the qualifications of the Social Organization *
 */
router.post(
  "/create",
  isAuthenticated,
  requireRole("ADMIN"),
  createSocialOrganization
);

/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     summary: Retrieves All registered Social Organizations
 *     tags: [Social Organizations]
 *     description: Retrieves All registered Social Organizations including status('PENDING', 'APPROVED')
 *     responses:
 *       200:
 *         content:
 *           application/json
 *
 */
router.get("/", getAllSocialOrganizations);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   get:
 *     summary: Get Social Organization by ID
 *     tags: [Social Organizations]
 *     description: Retrieve details of a specific Social Organization using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Social Organization to retrieve.
 *     responses:
 *       200:
 *         description: Social Organization details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the Social Organization
 *                 name:
 *                   type: string
 *                   description: Name of the Social Organization
 *                 contactPerson:
 *                   type: string
 *                   description: Contact person's name
 *                 email:
 *                   type: string
 *                   description: Email of the Social Organization
 *                 phone:
 *                   type: string
 *                   description: Phone number of the Social Organization
 *                 streetName:
 *                   type: string
 *                   description: Street Name of the Social Organization's address
 *                 number:
 *                   type: string
 *                   description: Address number of the Social Organization
 *                 city:
 *                   type: string
 *                   description: City of the Social Organization
 *                 country:
 *                   type: string
 *                   description: Country of the Social Organization
 *                 zipCode:
 *                   type: string
 *                   description: ZIP code of the Social Organization
 *                 qualifications:
 *                   type: string
 *                   description: Qualifications of the Social Organization
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       categoryId:
 *                         type: integer
 *                 status:
 *                   type: string
 *                   enum: [PENDING, APPROVED, REJECTED]
 *                   description: Status of the Social Organization
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date the Social Organization was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date the Social Organization was last updated
 *       404:
 *         description: Social Organization not found.
 */
router.get("/:id", getSocialOrganizationById);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   put:
 *     summary: Update Social Organization by ID
 *     tags: [Social Organizations]
 *     description: Update details of a specific Social Organization using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Social Organization to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Social Organization's Name
 *               contactPerson:
 *                 type: string
 *                 description: Contact person's name
 *               email:
 *                 type: string
 *                 description: Email of the Social Organization
 *               phone:
 *                 type: string
 *                 description: Phone number of the Social Organization
 *               streetName:
 *                 type: string
 *                 description: Street Name of the Social Organization's address
 *               number:
 *                 type: string
 *                 description: Address number of the Social Organization
 *               city:
 *                 type: string
 *                 description: City of the Social Organization
 *               country:
 *                 type: string
 *                 description: Country of the Social Organization
 *               zipCode:
 *                 type: string
 *                 description: ZIP code of the Social Organization
 *               qualifications:
 *                 type: string
 *                 description: Qualifications of the Social Organization
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of category IDs related to the Social Organization
 *     responses:
 *       200:
 *         description: Social Organization updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the updated Social Organization
 *                 name:
 *                   type: string
 *                   description: Updated name of the Social Organization
 *
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Social Organization not found.
 */
router.put("/:id", isAuthenticated, updateSocialOrganization);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   delete:
 *     summary: Delete Social Organization by ID
 *     tags: [Social Organizations]
 *     description: Delete a specific Social Organization using its ID. This operation cannot be undone.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Social Organization to delete.
 *     responses:
 *       204:
 *         description: Social Organization successfully deleted. No content is returned.
 *       404:
 *         description: Social Organization not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/:id",
  isAuthenticated,
  requireRole("ADMIN"),
  deleteSocialOrganization
);

export default router;
