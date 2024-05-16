import {Router} from 'express';
import controller from '../controllers/stream';

const router = Router();

router.post('/', controller.addStream);

export default router;
