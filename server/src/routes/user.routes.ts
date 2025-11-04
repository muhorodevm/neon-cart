import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { UploadService } from '../services/upload.service';

const router = Router();
const uploadService = new UploadService();

router.use(authenticate);

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
