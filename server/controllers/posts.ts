import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { ApiError } from '../middlewares/error';
import { InsertPost } from '@shared/schema';
import { CreatePostInput, CreateCommentInput } from '@shared/validation';
import { z } from 'zod';

/**
 * Get all posts with filtering and pagination
 */
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', category, location, search } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Get the posts
    const posts = await storage.getPosts({
      page: pageNum,
      limit: limitNum,
      category: category as string,
      location: location as string,
      search: search as string,
      userId: req.user?.id // Pass user ID for isLiked, isSaved, isFollowed
    });
    
    res.json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a post by ID
 */
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get the post
    const post = await storage.getPostByUuid(id, req.user?.id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Increment view count
    await storage.incrementPostViews(post.id);
    
    res.json({
      status: 'success',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new post
 */
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const postData = req.body as CreatePostInput;
    
    // Create the post
    const post = await storage.createPost(req.user.id, postData as InsertPost);
    
    // Get the post with details
    const createdPost = await storage.getPostById(post.id, req.user.id);
    
    res.status(201).json({
      status: 'success',
      data: createdPost
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a post
 */
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    const postData = req.body;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Check ownership
    if (post.user.id !== req.user.id) {
      throw ApiError.forbidden('You can only update your own posts');
    }
    
    // Update the post
    const updatedPost = await storage.updatePost(post.id, req.user.id, postData);
    if (!updatedPost) {
      throw ApiError.notFound('Post not found or you do not have permission to update it');
    }
    
    // Get the updated post with details
    const result = await storage.getPostById(updatedPost.id, req.user.id);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a post
 */
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Check ownership
    if (post.user.id !== req.user.id) {
      throw ApiError.forbidden('You can only delete your own posts');
    }
    
    // Delete the post
    const deleted = await storage.deletePost(post.id, req.user.id);
    if (!deleted) {
      throw ApiError.notFound('Post not found or you do not have permission to delete it');
    }
    
    res.json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get comments for a post
 */
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Get comments
    const comments = await storage.getCommentsByPostId(post.id);
    
    res.json({
      status: 'success',
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    const { content } = req.body as CreateCommentInput;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Create comment
    const comment = await storage.createComment(req.user.id, {
      postId: post.id,
      content
    });
    
    res.status(201).json({
      status: 'success',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id, commentId } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Delete comment
    const deleted = await storage.deleteComment(parseInt(commentId, 10), req.user.id);
    if (!deleted) {
      throw ApiError.notFound('Comment not found or you do not have permission to delete it');
    }
    
    res.json({
      status: 'success',
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like a post
 */
export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Like the post
    await storage.likePost(req.user.id, post.id);
    
    res.json({
      status: 'success',
      message: 'Post liked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unlike a post
 */
export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Unlike the post
    await storage.unlikePost(req.user.id, post.id);
    
    res.json({
      status: 'success',
      message: 'Post unliked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save a post
 */
export const savePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Save the post
    await storage.savePost(req.user.id, post.id);
    
    res.json({
      status: 'success',
      message: 'Post saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsave a post
 */
export const unsavePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Unsave the post
    await storage.unsavePost(req.user.id, post.id);
    
    res.json({
      status: 'success',
      message: 'Post unsaved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Follow a post
 */
export const followPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Follow the post
    await storage.followPost(req.user.id, post.id);
    
    res.json({
      status: 'success',
      message: 'Post followed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unfollow a post
 */
export const unfollowPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { id } = req.params;
    
    // Find post
    const post = await storage.getPostByUuid(id);
    if (!post) {
      throw ApiError.notFound('Post not found');
    }
    
    // Unfollow the post
    await storage.unfollowPost(req.user.id, post.id);
    
    res.json({
      status: 'success',
      message: 'Post unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get saved posts
 */
export const getSavedPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Get saved posts
    const posts = await storage.getSavedPosts(req.user.id, {
      page: pageNum,
      limit: limitNum,
      userId: req.user.id
    });
    
    res.json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get followed posts
 */
export const getFollowedPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Get followed posts
    const posts = await storage.getFollowedPosts(req.user.id, {
      page: pageNum,
      limit: limitNum,
      userId: req.user.id
    });
    
    res.json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's posts
 */
export const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Get user's posts
    const posts = await storage.getPosts({
      page: pageNum,
      limit: limitNum,
      userId: req.user.id
    });
    
    res.json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    next(error);
  }
};
