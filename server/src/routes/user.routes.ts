import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { UploadService } from '../services/upload.service';
import { UserController } from '../controllers/user.controller';

const router = Router();
const uploadService = new UploadService();
const userController = new UserController();

router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Address routes
router.post('/addresses', userController.addAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

// Avatar upload
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadService.uploadImage(req.file, 'avatars');
    res.json({ message: 'Avatar uploaded successfully', ...result });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
