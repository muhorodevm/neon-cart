import { imagekit } from '../config/imagekit.config';

export class UploadService {
  async uploadImage(file: Express.Multer.File, folder: string) {
    try {
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: folder,
      });

      return {
        url: result.url,
        fileId: result.fileId,
        thumbnailUrl: result.thumbnailUrl,
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(fileId: string) {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      console.error('ImageKit delete error:', error);
      throw new Error('Failed to delete image');
    }
  }
}
