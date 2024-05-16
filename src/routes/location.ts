import {Router} from 'express';
import controller from '../controllers/location';
import {authenticate} from '../middlewares/auth';

const router = Router();

//Todo Authenticate user
router.get('/', controller.getLocations);

router.get('/:id', controller.getLocation);

router.post('/', authenticate.admin, controller.addLocation);

router.patch('/:id', authenticate.admin, controller.updateLocation);

export default router;
