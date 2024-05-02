import {Router} from 'express';
import controller from '../controllers/service';

const router = Router();

router.post('/add-service', controller.addService);

export default router;
