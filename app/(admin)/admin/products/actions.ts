'use server';

/**
 * Server Actions for Products
 * Handles mutations and data revalidation
 */

import { revalidatePath } from 'next/cache';
import productsService from '@/lib/services/products-service';
import { ApiError } from '@/lib/api-client';
import { getAuthorFromEnv } from '@/lib/utils/author';
import type { Product, ProductCreateRequest } from '@/types/products';

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create a new product
 */
export const createProductAction = async (
  data: ProductCreateRequest
): Promise<ActionResult<Product>> => {
  try {
    // Add author from environment variables if not already provided
    const productData: ProductCreateRequest = {
      ...data,
      author: data.author || getAuthorFromEnv(),
    };

    const product = await productsService.createProduct(productData);
    revalidatePath('/admin/products');
    return {
      success: true,
      data: product,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product. Please try again.',
    };
  }
};

/**
 * Update an existing product
 */
export const updateProductAction = async (
  id: string,
  data: Product
): Promise<ActionResult<Product>> => {
  try {
    const product = await productsService.updateProduct(id, data);
    revalidatePath('/admin/products');
    return {
      success: true,
      data: product,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to update product. Please try again.',
    };
  }
};

/**
 * Delete a product
 */
export const deleteProductAction = async (id: string): Promise<ActionResult> => {
  try {
    await productsService.deleteProduct(id);
    revalidatePath('/admin/products');
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to delete product. Please try again.',
    };
  }
};

