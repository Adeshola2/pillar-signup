import { Router } from 'express';
import { getMe, updateMe } from '../controllers/users.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/user.validators.js';

const router = Router();

router.use(requireAuth);
router.get('/me', getMe);
router.patch('/me', validate(updateProfileSchema), updateMe);

export default router;
