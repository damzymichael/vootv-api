import {Router} from 'express';
import controller from '../controllers/user';

const router = Router();

router.post('/register', controller.register);

router.post('/login', controller.login);

router.patch('/account-info/:userId', controller.updateAccount);

router.post('/verify-email', controller.verifyEmail);

router.get('/resend-email-verify-code', controller.resendVerificationCode);

export default router;
