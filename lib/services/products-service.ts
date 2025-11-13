/**
 * Products Service
 * Handles all API operations for products data from the North API
 */

import apiClient from '../api-client';
import type { Product, ProductCreateRequest, ProductSearchRequest } from '@/types/products';

const productsService = {
  /**
   * Get all products
   * @returns Array of products
   */
  async getProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>('/products');
  },

  /**
   * Get a single product by ID
   * @param id Product UUID
   * @returns Product
   */
  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Create a new product
   * @param data Product data to create
   * @returns Created product
   */
  async createProduct(data: ProductCreateRequest): Promise<Product> {
    return apiClient.post<Product>('/products', data);
  },

  /**
   * Update an existing product
   * @param id Product UUID
   * @param data Product data to update (full Product object)
   * @returns Updated product
   */
  async updateProduct(id: string, data: Product): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  /**
   * Delete a product
   * @param id Product UUID
   * @returns void
   */
  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`);
  },

  /**
   * Search products
   * @param query Search query string
   * @returns Array of matching products
   */
  async searchProducts(query: string): Promise<Product[]> {
    const searchRequest: ProductSearchRequest = { query };
    return apiClient.post<Product[]>('/products/search', searchRequest);
  },
};

export default productsService;

