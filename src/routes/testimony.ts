import {Router} from 'express';
import controller from '../controllers/testimony';
import {authenticate} from '../middlewares/auth';

const router = Router();

router.use(authenticate.user);

router.get('/', controller.getTestimonies);

router.get('/:id', controller.getTestimony);

router.post('/', controller.addTestimony);

export default router;
