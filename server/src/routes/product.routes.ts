import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { uploadImage } from '../services/upload.service';
import { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts } from '../controllers/product.functions';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  deleteProduct
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

      const result = await uploadImage(req.file, 'products');
      return res.json({ message: 'Product image uploaded successfully', ...result });
    } catch (error) {
      return res.status(500).json({ error: 'Upload failed' });
    }
  }
);

export default router;
