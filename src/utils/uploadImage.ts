import { storage } from '../lib/firebase.js';
import { randomUUID } from 'crypto';

/**
 * Uploads a base64 image to Firebase Storage
 * @param base64Image - The base64 encoded image string
 * @param folder - The folder path in storage (default: 'avatars')
 * @returns The public URL of the uploaded image
 */
export const uploadImageToStorage = async (
  base64Image: string,
  folder: string = 'avatars'
): Promise<string> => {
  try {
    // Extract the base64 data and mime type
    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename
    const fileName = `${folder}/${randomUUID()}.${getFileExtension(mimeType)}`;

    // Get a reference to the storage bucket
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    // Upload the file
    await file.save(imageBuffer, {
      metadata: {
        contentType: mimeType,
      },
      public: true,
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Deletes an image from Firebase Storage by URL
 * @param imageUrl - The public URL of the image to delete
 */
export const deleteImageFromStorage = async (
  imageUrl: string
): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlPattern = /https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/;
    const matches = imageUrl.match(urlPattern);

    if (!matches || matches.length < 2) {
      console.warn('Invalid storage URL format, skipping deletion');
      return;
    }

    const filePath = decodeURIComponent(matches[1]);
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    // Check if file exists before deleting
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`Successfully deleted image: ${filePath}`);
    }
  } catch (error) {
    console.error('Error deleting image from Firebase Storage:', error);
    // Don't throw error, just log it as deletion failure shouldn't block the request
  }
};

/**
 * Helper function to get file extension from mime type
 * @param mimeType - The mime type of the image
 * @returns The file extension
 */
const getFileExtension = (mimeType: string): string => {
  const extensions: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return extensions[mimeType] || 'jpg';
};
