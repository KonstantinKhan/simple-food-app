/**
 * Types for Product entities
 * Based on spec-simple-food-api-products.yaml and spec-simple-food-common.yaml
 */

// Measure type used in NutritionalValue and Weight (single translation)
export interface Measure {
  id: string;
  code: string;
  measureName: string;
  measureShortName: string;
}

// Author type
export interface Author {
  id: string;
  name?: string;
  email?: string;
}

// Nutritional value with measurement unit
export interface NutritionalValue {
  title: string;
  shortTitle: string;
  nutritionalValue: number;
  measure: Measure;
}

// Weight with measurement unit
export interface Weight {
  weightValue: number;
  measure: Measure;
}

// Product ID type
export type ProductId = string;

// Product entity
export interface Product {
  productId: ProductId;
  productName: string;
  productCalories: NutritionalValue;
  productProteins: NutritionalValue;
  productFats: NutritionalValue;
  productCarbohydrates: NutritionalValue;
  weight: Weight;
  author?: Author;
  categories?: string[];
}

// Product create request (without productId)
export interface ProductCreateRequest {
  productName: string;
  productCalories: NutritionalValue;
  productProteins: NutritionalValue;
  productFats: NutritionalValue;
  productCarbohydrates: NutritionalValue;
  weight: Weight;
  author?: Author;
  categories?: string[];
}

// Product search request
export interface ProductSearchRequest {
  query: string;
}

