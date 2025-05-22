import express from 'express';
import { auth } from '../middlewares/auth';
import { validateBody, validateParams } from '../middlewares/validation';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserPreferences,
  updateSelectedCategories,
  updateNotificationPreferences
} from '../controllers/users';
import { updateProfileSchema } from '@shared/validation';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const userIdParam = z.object({
  id: z.string().uuid()
});

const selectedCategoriesSchema = z.object({
  categories: z.array(z.string()).min(1, 'Select at least one category')
});

const notificationPreferencesSchema = z.object({
  preferences: z.record(z.boolean()).refine(
    (val) => Object.keys(val).length > 0,
    { message: 'At least one notification preference is required' }
  )
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User UUID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         uuid:
 *                           type: string
 *                           format: uuid
 *                         username:
 *                           type: string
 *                         name:
 *                           type: string
 *                         profileImage:
 *                           type: string
 *                         location:
 *                           type: string
 *                         visibility:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         selectedCategories:
 *                           type: array
 *                           items:
 *                             type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: This profile is private
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateParams(userIdParam), getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *                 enum: [amritsar, jalandhar, ludhiana, chandigarh, gurugram]
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/profile', auth, validateBody(updateProfileSchema), updateUserProfile);

/**
 * @swagger
 * /users/preferences:
 *   get:
 *     summary: Get user preferences
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     selectedCategories:
 *                       type: array
 *                       items:
 *                         type: string
 *                     notificationPreferences:
 *                       type: object
 *                       additionalProperties:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Preferences not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/preferences', auth, getUserPreferences);

/**
 * @swagger
 * /users/preferences/categories:
 *   post:
 *     summary: Update selected categories
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categories
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Categories updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     selectedCategories:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/preferences/categories', auth, validateBody(selectedCategoriesSchema), updateSelectedCategories);

/**
 * @swagger
 * /users/preferences/notifications:
 *   post:
 *     summary: Update notification preferences
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferences
 *             properties:
 *               preferences:
 *                 type: object
 *                 additionalProperties:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     notificationPreferences:
 *                       type: object
 *                       additionalProperties:
 *                         type: boolean
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/preferences/notifications', auth, validateBody(notificationPreferencesSchema), updateNotificationPreferences);

export default router;
