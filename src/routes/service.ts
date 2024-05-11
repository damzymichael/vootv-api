import {Router} from 'express';
import controller from '../controllers/service';

const router = Router();

router.post('/:locationId', controller.addService);

//Todo Patch function
router.patch('/:id');

export default router;
