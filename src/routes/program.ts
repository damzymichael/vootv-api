import {Router} from 'express';
import controller from '../controllers/program';
import {authenticate} from '../middlewares/auth';

const router = Router();

router.get('/', controller.getPrograms);

router.get('/:id', controller.getProgram);

router.post('/', authenticate.admin, controller.addProgram);

export default router;
