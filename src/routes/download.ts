import {Router} from 'express';
import controller from '../controllers/download';

const router = Router();

router.post('/', controller.addDownload);

export default router;
