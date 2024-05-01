import {Router} from 'express';
import controller from '../controllers/audio';
import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

const router = Router();

router.post('/add', upload.single('audio'), controller.addAudio);

export default router;
