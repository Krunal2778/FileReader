import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const visibilityEnum = pgEnum('visibility', ['public', 'private']);
export const locationEnum = pgEnum('location', ['amritsar', 'jalandhar', 'ludhiana', 'chandigarh', 'gurugram']);
export const postCategoryEnum = pgEnum('post_category', [
  'announcement', 'event', 'traffic_alert', 'looking_for', 'rental_to_let',
  'reviews', 'recommendations', 'news', 'citizen_reporter', 'community_services',
  'health_capsule', 'science_knowledge', 'article', 'jobs', 'help',
  'sale', 'property', 'rental_required', 'promotion', 'page_3'
]);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password'),
  googleId: text('google_id').unique(),
  appleId: text('apple_id').unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  profileImage: text('profile_image'),
  role: userRoleEnum('role').default('user').notNull(),
  visibility: visibilityEnum('visibility').default('public').notNull(),
  location: locationEnum('location').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// User preferences for notifications
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  selectedCategories: json('selected_categories').$type<string[]>().notNull(),
  notificationPreferences: json('notification_preferences').$type<Record<string, boolean>>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: postCategoryEnum('name').notNull(),
  displayName: text('display_name').notNull(),
  icon: text('icon').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Subcategories table
export const subcategories = pgTable('subcategories', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  subcategoryId: integer('subcategory_id').references(() => subcategories.id),
  location: locationEnum('location').notNull(),
  locationDetails: text('location_details').notNull(),
  imageUrl: text('image_url'),
  visibility: visibilityEnum('visibility').default('public').notNull(),
  metadata: json('metadata').$type<Record<string, string>>(),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Comments table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Likes table
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Saved posts (bookmarks)
export const savedPosts = pgTable('saved_posts', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Followed posts
export const followedPosts = pgTable('followed_posts', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  savedPosts: many(savedPosts),
  followedPosts: many(followedPosts),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId]
  })
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id]
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  }),
  subcategory: one(subcategories, {
    fields: [posts.subcategoryId],
    references: [subcategories.id]
  }),
  comments: many(comments),
  likes: many(likes),
  savedPosts: many(savedPosts),
  followedPosts: many(followedPosts)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
  subcategories: many(subcategories)
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id]
  }),
  posts: many(posts)
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  })
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id]
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id]
  })
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(6).optional()
}).omit({ id: true, uuid: true, createdAt: true, updatedAt: true, isVerified: true });

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, createdAt: true, updatedAt: true });

export const insertPostSchema = createInsertSchema(posts).omit({ id: true, uuid: true, userId: true, viewCount: true, createdAt: true, updatedAt: true });

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, userId: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type Category = typeof categories.$inferSelect;
export type Subcategory = typeof subcategories.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Like = typeof likes.$inferSelect;
export type SavedPost = typeof savedPosts.$inferSelect;
export type FollowedPost = typeof followedPosts.$inferSelect;
