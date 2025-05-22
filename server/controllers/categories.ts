import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { ApiError } from '../middlewares/error';

/**
 * Get all categories
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await storage.getCategories();
    
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a category by ID
 */
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const category = await storage.getCategoryById(parseInt(id, 10));
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    
    res.json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all subcategories
 */
export const getSubcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.query;
    
    let subcategories;
    if (categoryId) {
      subcategories = await storage.getSubcategories(parseInt(categoryId as string, 10));
    } else {
      subcategories = await storage.getSubcategories();
    }
    
    res.json({
      status: 'success',
      data: subcategories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a subcategory by ID
 */
export const getSubcategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const subcategory = await storage.getSubcategoryById(parseInt(id, 10));
    if (!subcategory) {
      throw ApiError.notFound('Subcategory not found');
    }
    
    res.json({
      status: 'success',
      data: subcategory
    });
  } catch (error) {
    next(error);
  }
};
