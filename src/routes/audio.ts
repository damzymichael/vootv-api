import {Router} from 'express';
import controller from '../controllers/audio';
import multer from 'multer';
import { authenticate } from '../middlewares/auth';

const upload = multer({storage: multer.memoryStorage()});

const router = Router();

//Todo Authenticate as user before sending
router.get('/', authenticate.admin, controller.getAudios);

router.get('/:id', controller.getAudio);

//Todo Authenticate as admin before posting
router.post('/', upload.single('audio'), controller.addAudio);

router.delete('/:id', controller.deleteAudio);

export default router;
