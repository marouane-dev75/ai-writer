/**
 * AI Transformer Service
 * 
 * Pure functions for text transformations.
 * This service provides the foundation for AI-powered text transformations.
 */

/**
 * Transforms text to uppercase
 * @param text - The text to transform
 * @returns The uppercased text
 */
export const uppercaseTransform = (text: string): string => {
  return text.toUpperCase();
};

/**
 * Transforms text to lowercase
 * @param text - The text to transform
 * @returns The lowercased text
 */
export const lowercaseTransform = (text: string): string => {
  return text.toLowerCase();
};
