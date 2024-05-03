import {Router} from 'express';
import controller from '../controllers/testimony';
import {authenticate} from '../middlewares/auth';

const router = Router();

router.use(authenticate.user);

router.get('/', controller.getTestimonies);

router.post('/add-testimony', controller.addTestimony);

router.get('/get-testimony/:id', controller.getTestimony);

export default router;
