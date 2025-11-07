import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { uploadImage } from '../services/upload.service';
import { getProfile, updateProfile, addAddress, updateAddress, deleteAddress, getAddresses } from '../controllers/user.functions';

const router = Router();

router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Avatar upload
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadImage(req.file, 'avatars');
    return res.json({ message: 'Avatar uploaded successfully', ...result });
  } catch (error) {
    return res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
