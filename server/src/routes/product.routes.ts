import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { UploadService } from '../services/upload.service';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const uploadService = new UploadService();
const productController = new ProductController();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  productController.deleteProduct
);

router.post(
  '/upload-image',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await uploadService.uploadImage(req.file, 'products');
      res.json({ message: 'Product image uploaded successfully', ...result });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

export default router;
