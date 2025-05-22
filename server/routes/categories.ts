import express from 'express';
import { validateParams, validateQuery } from '../middlewares/validation';
import { 
  getCategories, 
  getCategoryById, 
  getSubcategories, 
  getSubcategoryById 
} from '../controllers/categories';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const categoryIdParam = z.object({
  id: z.string().transform(val => parseInt(val, 10))
});

const subcategoryIdParam = z.object({
  id: z.string().transform(val => parseInt(val, 10))
});

const subcategoryQueryParam = z.object({
  categoryId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined)
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateParams(categoryIdParam), getCategoryById);

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter subcategories by category ID
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subcategory'
 */
router.get('/subcategories', validateQuery(subcategoryQueryParam), getSubcategories);

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Subcategory'
 *       404:
 *         description: Subcategory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/subcategories/:id', validateParams(subcategoryIdParam), getSubcategoryById);

export default router;
