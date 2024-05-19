import {Router} from 'express';
import controller from '../controllers/program';
import {authenticate} from '../middlewares/auth';
import multer from 'multer';

const {admin} = authenticate;

const upload = multer({storage: multer.memoryStorage()});

const router = Router();

router.get('/', controller.getPrograms);

router.get('/:id', controller.getProgram);

router.post('/', admin, upload.single('banner'), controller.addProgram);

router.delete('/:id', controller.deleteProgram);

router.patch('/:id', upload.single('banner'), controller.updateProgram);

export default router;
