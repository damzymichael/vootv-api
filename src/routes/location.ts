import {Router} from 'express';
import controller from '../controllers/location';
import {authenticate} from '../middlewares/auth';

const router = Router();

router.get('/', authenticate.user, controller.getLocations);

router.get('/:id', authenticate.user, controller.getLocation);

router.post('/', authenticate.admin, controller.addLocation);

router.patch('/:id', authenticate.admin, controller.updateLocation);

export default router;
