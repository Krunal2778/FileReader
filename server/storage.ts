import { eq, and, desc, sql, like, or, inArray } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import { PaginatedResponse, PostFilterParams, PostWithDetails } from "@shared/types";
import bcrypt from "bcryptjs";

// Interface for storage operations
export interface IStorage {
  // User related operations
  getUser(id: number): Promise<schema.User | undefined>;
  getUserByUuid(uuid: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  getUserByGoogleId(googleId: string): Promise<schema.User | undefined>;
  getUserByAppleId(appleId: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  updateUser(id: number, data: Partial<schema.User>): Promise<schema.User | undefined>;
  verifyUserEmail(id: number): Promise<schema.User | undefined>;
  
  // User preferences
  getUserPreferences(userId: number): Promise<schema.UserPreferences | undefined>;
  createUserPreferences(preferences: schema.InsertUserPreferences): Promise<schema.UserPreferences>;
  updateUserPreferences(userId: number, data: Partial<schema.UserPreferences>): Promise<schema.UserPreferences | undefined>;
  
  // Category operations
  getCategories(): Promise<schema.Category[]>;
  getCategoryById(id: number): Promise<schema.Category | undefined>;
  getCategoryByName(name: string): Promise<schema.Category | undefined>;
  
  // Subcategory operations
  getSubcategories(categoryId?: number): Promise<schema.Subcategory[]>;
  getSubcategoryById(id: number): Promise<schema.Subcategory | undefined>;
  
  // Post operations
  getPosts(filters: PostFilterParams): Promise<PaginatedResponse<PostWithDetails>>;
  getPostById(id: number, userId?: number): Promise<PostWithDetails | undefined>;
  getPostByUuid(uuid: string, userId?: number): Promise<PostWithDetails | undefined>;
  createPost(userId: number, post: schema.InsertPost): Promise<schema.Post>;
  updatePost(id: number, userId: number, data: Partial<schema.Post>): Promise<schema.Post | undefined>;
  deletePost(id: number, userId: number): Promise<boolean>;
  incrementPostViews(id: number): Promise<void>;
  
  // Comment operations
  getCommentsByPostId(postId: number): Promise<schema.Comment[]>;
  createComment(userId: number, comment: schema.InsertComment): Promise<schema.Comment>;
  deleteComment(id: number, userId: number): Promise<boolean>;
  
  // Like operations
  likePost(userId: number, postId: number): Promise<schema.Like>;
  unlikePost(userId: number, postId: number): Promise<boolean>;
  
  // Saved posts operations
  savePost(userId: number, postId: number): Promise<schema.SavedPost>;
  unsavePost(userId: number, postId: number): Promise<boolean>;
  getSavedPosts(userId: number, filters: PostFilterParams): Promise<PaginatedResponse<PostWithDetails>>;
  
  // Followed posts operations
  followPost(userId: number, postId: number): Promise<schema.FollowedPost>;
  unfollowPost(userId: number, postId: number): Promise<boolean>;
  getFollowedPosts(userId: number, filters: PostFilterParams): Promise<PaginatedResponse<PostWithDetails>>;
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  /* User related methods */
  async getUser(id: number): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUuid(uuid: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.uuid, uuid));
    return user;
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.googleId, googleId));
    return user;
  }

  async getUserByAppleId(appleId: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.appleId, appleId));
    return user;
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    // Hash password if provided
    let userData = { ...user };
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const [createdUser] = await db.insert(schema.users).values(userData).returning();
    return createdUser;
  }

  async updateUser(id: number, data: Partial<schema.User>): Promise<schema.User | undefined> {
    // Hash password if provided
    let userData = { ...data };
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    userData.updatedAt = new Date();
    
    const [updatedUser] = await db
      .update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    
    return updatedUser;
  }

  async verifyUserEmail(id: number): Promise<schema.User | undefined> {
    const [updatedUser] = await db
      .update(schema.users)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    
    return updatedUser;
  }

  /* User preferences methods */
  async getUserPreferences(userId: number): Promise<schema.UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(schema.userPreferences)
      .where(eq(schema.userPreferences.userId, userId));
    
    return preferences;
  }

  async createUserPreferences(preferences: schema.InsertUserPreferences): Promise<schema.UserPreferences> {
    const [createdPreferences] = await db
      .insert(schema.userPreferences)
      .values(preferences)
      .returning();
    
    return createdPreferences;
  }

  async updateUserPreferences(userId: number, data: Partial<schema.UserPreferences>): Promise<schema.UserPreferences | undefined> {
    data.updatedAt = new Date();
    
    const [updatedPreferences] = await db
      .update(schema.userPreferences)
      .set(data)
      .where(eq(schema.userPreferences.userId, userId))
      .returning();
    
    return updatedPreferences;
  }

  /* Category methods */
  async getCategories(): Promise<schema.Category[]> {
    return db.select().from(schema.categories).orderBy(schema.categories.displayName);
  }

  async getCategoryById(id: number): Promise<schema.Category | undefined> {
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id));
    
    return category;
  }

  async getCategoryByName(name: string): Promise<schema.Category | undefined> {
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.name, name));
    
    return category;
  }

  /* Subcategory methods */
  async getSubcategories(categoryId?: number): Promise<schema.Subcategory[]> {
    if (categoryId) {
      return db
        .select()
        .from(schema.subcategories)
        .where(eq(schema.subcategories.categoryId, categoryId))
        .orderBy(schema.subcategories.displayName);
    }
    
    return db
      .select()
      .from(schema.subcategories)
      .orderBy(schema.subcategories.displayName);
  }

  async getSubcategoryById(id: number): Promise<schema.Subcategory | undefined> {
    const [subcategory] = await db
      .select()
      .from(schema.subcategories)
      .where(eq(schema.subcategories.id, id));
    
    return subcategory;
  }

  /* Post methods */
  async getPosts(filters: PostFilterParams): Promise<PaginatedResponse<PostWithDetails>> {
    const { page = 1, limit = 10, category, location, search, userId } = filters;
    const offset = (page - 1) * limit;
    
    // Build query conditions
    let conditions = [];
    
    if (category) {
      // Get category ID from name if provided as string
      const categoryObj = await this.getCategoryByName(category);
      if (categoryObj) {
        conditions.push(eq(schema.posts.categoryId, categoryObj.id));
      }
    }
    
    if (location) {
      conditions.push(eq(schema.posts.location, location));
    }
    
    if (userId) {
      conditions.push(eq(schema.posts.userId, userId));
    }
    
    if (search) {
      conditions.push(
        or(
          like(schema.posts.title, `%${search}%`),
          like(schema.posts.description, `%${search}%`)
        )
      );
    }
    
    // Public posts only (unless filtering by specific user)
    if (!userId) {
      conditions.push(eq(schema.posts.visibility, 'public'));
    }
    
    // Create final where clause
    const whereClause = conditions.length > 0 
      ? and(...conditions) 
      : undefined;
    
    // Count total posts matching filter
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.posts)
      .where(whereClause);
    
    // Get posts with related data
    const postsData = await db
      .select({
        id: schema.posts.id,
        uuid: schema.posts.uuid,
        title: schema.posts.title,
        description: schema.posts.description,
        categoryId: schema.posts.categoryId,
        subcategoryId: schema.posts.subcategoryId,
        location: schema.posts.location,
        locationDetails: schema.posts.locationDetails,
        imageUrl: schema.posts.imageUrl,
        visibility: schema.posts.visibility,
        metadata: schema.posts.metadata,
        viewCount: schema.posts.viewCount,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        userId: schema.posts.userId,
      })
      .from(schema.posts)
      .where(whereClause)
      .orderBy(desc(schema.posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get related data for posts
    const postsWithDetails = await Promise.all(
      postsData.map(async (post) => {
        // Get user info
        const [user] = await db
          .select({
            id: schema.users.id,
            uuid: schema.users.uuid,
            name: schema.users.name,
            username: schema.users.username,
            profileImage: schema.users.profileImage,
          })
          .from(schema.users)
          .where(eq(schema.users.id, post.userId));

        // Get category info
        const [category] = await db
          .select({
            id: schema.categories.id,
            name: schema.categories.name,
            displayName: schema.categories.displayName,
          })
          .from(schema.categories)
          .where(eq(schema.categories.id, post.categoryId));

        // Get subcategory if exists
        let subcategory = undefined;
        if (post.subcategoryId) {
          [subcategory] = await db
            .select({
              id: schema.subcategories.id,
              name: schema.subcategories.name,
              displayName: schema.subcategories.displayName,
            })
            .from(schema.subcategories)
            .where(eq(schema.subcategories.id, post.subcategoryId));
        }

        // Count likes
        const [{ count: likeCount }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(schema.likes)
          .where(eq(schema.likes.postId, post.id));

        // Count comments
        const [{ count: commentCount }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(schema.comments)
          .where(eq(schema.comments.postId, post.id));

        // Check if current user liked the post
        let isLiked = false;
        let isSaved = false;
        let isFollowed = false;
        
        if (filters.userId) {
          const [userLike] = await db
            .select()
            .from(schema.likes)
            .where(and(
              eq(schema.likes.postId, post.id),
              eq(schema.likes.userId, filters.userId)
            ));
          
          isLiked = !!userLike;
          
          const [userSaved] = await db
            .select()
            .from(schema.savedPosts)
            .where(and(
              eq(schema.savedPosts.postId, post.id),
              eq(schema.savedPosts.userId, filters.userId)
            ));
          
          isSaved = !!userSaved;
          
          const [userFollowed] = await db
            .select()
            .from(schema.followedPosts)
            .where(and(
              eq(schema.followedPosts.postId, post.id),
              eq(schema.followedPosts.userId, filters.userId)
            ));
          
          isFollowed = !!userFollowed;
        }

        return {
          ...post,
          user,
          category,
          subcategory,
          likeCount,
          commentCount,
          isLiked,
          isSaved,
          isFollowed
        } as PostWithDetails;
      })
    );

    return {
      data: postsWithDetails,
      meta: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit)
      }
    };
  }

  async getPostById(id: number, userId?: number): Promise<PostWithDetails | undefined> {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id));
    
    if (!post) return undefined;
    
    // Get user info
    const [user] = await db
      .select({
        id: schema.users.id,
        uuid: schema.users.uuid,
        name: schema.users.name,
        username: schema.users.username,
        profileImage: schema.users.profileImage,
      })
      .from(schema.users)
      .where(eq(schema.users.id, post.userId));

    // Get category info
    const [category] = await db
      .select({
        id: schema.categories.id,
        name: schema.categories.name,
        displayName: schema.categories.displayName,
      })
      .from(schema.categories)
      .where(eq(schema.categories.id, post.categoryId));

    // Get subcategory if exists
    let subcategory = undefined;
    if (post.subcategoryId) {
      [subcategory] = await db
        .select({
          id: schema.subcategories.id,
          name: schema.subcategories.name,
          displayName: schema.subcategories.displayName,
        })
        .from(schema.subcategories)
        .where(eq(schema.subcategories.id, post.subcategoryId));
    }

    // Count likes
    const [{ count: likeCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.likes)
      .where(eq(schema.likes.postId, post.id));

    // Count comments
    const [{ count: commentCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.comments)
      .where(eq(schema.comments.postId, post.id));

    // Check if current user liked the post
    let isLiked = false;
    let isSaved = false;
    let isFollowed = false;
    
    if (userId) {
      const [userLike] = await db
        .select()
        .from(schema.likes)
        .where(and(
          eq(schema.likes.postId, post.id),
          eq(schema.likes.userId, userId)
        ));
      
      isLiked = !!userLike;
      
      const [userSaved] = await db
        .select()
        .from(schema.savedPosts)
        .where(and(
          eq(schema.savedPosts.postId, post.id),
          eq(schema.savedPosts.userId, userId)
        ));
      
      isSaved = !!userSaved;
      
      const [userFollowed] = await db
        .select()
        .from(schema.followedPosts)
        .where(and(
          eq(schema.followedPosts.postId, post.id),
          eq(schema.followedPosts.userId, userId)
        ));
      
      isFollowed = !!userFollowed;
    }

    return {
      ...post,
      user,
      category,
      subcategory,
      likeCount,
      commentCount,
      isLiked,
      isSaved,
      isFollowed
    };
  }

  async getPostByUuid(uuid: string, userId?: number): Promise<PostWithDetails | undefined> {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.uuid, uuid));
    
    if (!post) return undefined;
    
    return this.getPostById(post.id, userId);
  }

  async createPost(userId: number, post: schema.InsertPost): Promise<schema.Post> {
    const [createdPost] = await db
      .insert(schema.posts)
      .values({
        ...post,
        userId
      })
      .returning();
    
    return createdPost;
  }

  async updatePost(id: number, userId: number, data: Partial<schema.Post>): Promise<schema.Post | undefined> {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(and(
        eq(schema.posts.id, id),
        eq(schema.posts.userId, userId)
      ));
    
    if (!post) return undefined;
    
    data.updatedAt = new Date();
    
    const [updatedPost] = await db
      .update(schema.posts)
      .set(data)
      .where(eq(schema.posts.id, id))
      .returning();
    
    return updatedPost;
  }

  async deletePost(id: number, userId: number): Promise<boolean> {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(and(
        eq(schema.posts.id, id),
        eq(schema.posts.userId, userId)
      ));
    
    if (!post) return false;
    
    await db
      .delete(schema.posts)
      .where(eq(schema.posts.id, id));
    
    return true;
  }

  async incrementPostViews(id: number): Promise<void> {
    await db
      .update(schema.posts)
      .set({
        viewCount: sql`${schema.posts.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(schema.posts.id, id));
  }

  /* Comment methods */
  async getCommentsByPostId(postId: number): Promise<schema.Comment[]> {
    const comments = await db
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.postId, postId))
      .orderBy(schema.comments.createdAt);
    
    return comments;
  }

  async createComment(userId: number, comment: schema.InsertComment): Promise<schema.Comment> {
    const [createdComment] = await db
      .insert(schema.comments)
      .values({
        ...comment,
        userId
      })
      .returning();
    
    return createdComment;
  }

  async deleteComment(id: number, userId: number): Promise<boolean> {
    const [comment] = await db
      .select()
      .from(schema.comments)
      .where(and(
        eq(schema.comments.id, id),
        eq(schema.comments.userId, userId)
      ));
    
    if (!comment) return false;
    
    await db
      .delete(schema.comments)
      .where(eq(schema.comments.id, id));
    
    return true;
  }

  /* Like methods */
  async likePost(userId: number, postId: number): Promise<schema.Like> {
    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(schema.likes)
      .where(and(
        eq(schema.likes.userId, userId),
        eq(schema.likes.postId, postId)
      ));
    
    if (existingLike) return existingLike;
    
    // Create new like
    const [like] = await db
      .insert(schema.likes)
      .values({
        userId,
        postId
      })
      .returning();
    
    return like;
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    await db
      .delete(schema.likes)
      .where(and(
        eq(schema.likes.userId, userId),
        eq(schema.likes.postId, postId)
      ));
    
    return true;
  }

  /* Saved posts methods */
  async savePost(userId: number, postId: number): Promise<schema.SavedPost> {
    // Check if already saved
    const [existingSave] = await db
      .select()
      .from(schema.savedPosts)
      .where(and(
        eq(schema.savedPosts.userId, userId),
        eq(schema.savedPosts.postId, postId)
      ));
    
    if (existingSave) return existingSave;
    
    // Create new saved post
    const [savedPost] = await db
      .insert(schema.savedPosts)
      .values({
        userId,
        postId
      })
      .returning();
    
    return savedPost;
  }

  async unsavePost(userId: number, postId: number): Promise<boolean> {
    await db
      .delete(schema.savedPosts)
      .where(and(
        eq(schema.savedPosts.userId, userId),
        eq(schema.savedPosts.postId, postId)
      ));
    
    return true;
  }

  async getSavedPosts(userId: number, filters: PostFilterParams): Promise<PaginatedResponse<PostWithDetails>> {
    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;
    
    // Get saved post IDs
    const savedPostsIds = await db
      .select({ postId: schema.savedPosts.postId })
      .from(schema.savedPosts)
      .where(eq(schema.savedPosts.userId, userId));
    
    if (savedPostsIds.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0
        }
      };
    }
    
    const postIds = savedPostsIds.map(item => item.postId);
    
    // Count total saved posts
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.posts)
      .where(inArray(schema.posts.id, postIds));
    
    // Get posts with details
    const postsData = await db
      .select()
      .from(schema.posts)
      .where(inArray(schema.posts.id, postIds))
      .orderBy(desc(schema.posts.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Enrich with details
    const postsWithDetails = await Promise.all(
      postsData.map(post => this.getPostById(post.id, userId))
    );
    
    return {
      data: postsWithDetails.filter(Boolean) as PostWithDetails[],
      meta: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit)
      }
    };
  }

  /* Followed posts methods */
  async followPost(userId: number, postId: number): Promise<schema.FollowedPost> {
    // Check if already followed
    const [existingFollow] = await db
      .select()
      .from(schema.followedPosts)
      .where(and(
        eq(schema.followedPosts.userId, userId),
        eq(schema.followedPosts.postId, postId)
      ));
    
    if (existingFollow) return existingFollow;
    
    // Create new followed post
    const [followedPost] = await db
      .insert(schema.followedPosts)
      .values({
        userId,
        postId
      })
      .returning();
    
    return followedPost;
  }

  async unfollowPost(userId: number, postId: number): Promise<boolean> {
    await db
      .delete(schema.followedPosts)
      .where(and(
        eq(schema.followedPosts.userId, userId),
        eq(schema.followedPosts.postId, postId)
      ));
    
    return true;
  }

  async getFollowedPosts(userId: number, filters: PostFilterParams): Promise<PaginatedResponse<PostWithDetails>> {
    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;
    
    // Get followed post IDs
    const followedPostsIds = await db
      .select({ postId: schema.followedPosts.postId })
      .from(schema.followedPosts)
      .where(eq(schema.followedPosts.userId, userId));
    
    if (followedPostsIds.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0
        }
      };
    }
    
    const postIds = followedPostsIds.map(item => item.postId);
    
    // Count total followed posts
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.posts)
      .where(inArray(schema.posts.id, postIds));
    
    // Get posts with details
    const postsData = await db
      .select()
      .from(schema.posts)
      .where(inArray(schema.posts.id, postIds))
      .orderBy(desc(schema.posts.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Enrich with details
    const postsWithDetails = await Promise.all(
      postsData.map(post => this.getPostById(post.id, userId))
    );
    
    return {
      data: postsWithDetails.filter(Boolean) as PostWithDetails[],
      meta: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit)
      }
    };
  }
}

export const storage = new DatabaseStorage();
