import { encrypt, decrypt } from '../config/env';

/**
 * Utility functions for handling sensitive data in MongoDB
 * This ensures that PII (Personally Identifiable Information) is 
 * stored encrypted in the database
 */

/**
 * Schema plugin to automatically encrypt specified fields in a document before saving
 * @param schema - Mongoose schema
 * @param fields - Array of field names to encrypt
 */
export const encryptFields = (schema: any, fields: string[]): void => {
  // Pre-save hook to encrypt fields
  schema.pre('save', function(this: any, next: any) {
    for (const field of fields) {
      if (this[field] && this.isModified(field)) {
        this[field] = encrypt(this[field]);
      }
    }
    next();
  });

  // Add instance methods to access decrypted fields
  schema.methods.getDecrypted = function(this: any, field: string): string | null {
    if (!this[field]) return null;
    
    try {
      return decrypt(this[field]);
    } catch (error) {
      console.error(`Error decrypting field ${field}:`, error);
      return null;
    }
  };

  // Add a toJSON transform to automatically decrypt fields for API responses
  schema.set('toJSON', {
    transform: function(this: any, doc: any, ret: any, options: any) {
      for (const field of fields) {
        if (ret[field]) {
          try {
            ret[field] = decrypt(ret[field]);
          } catch (error) {
            // If decryption fails, keep the encrypted value
            console.error(`Error decrypting field ${field}:`, error);
          }
        }
      }
      return ret;
    }
  });
};

/**
 * Encrypt a single piece of text
 * @param text - Text to encrypt
 * @returns Encrypted text
 */
export const encryptText = (text: string): string => {
  if (!text) return '';
  return encrypt(text);
};

/**
 * Decrypt a single piece of text
 * @param encryptedText - Encrypted text to decrypt
 * @returns Decrypted text
 */
export const decryptText = (encryptedText: string): string => {
  if (!encryptedText) return '';
  try {
    return decrypt(encryptedText);
  } catch (error) {
    console.error('Error decrypting text:', error);
    return '';
  }
};
