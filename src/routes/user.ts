import {Router} from 'express';
import controller from '../controllers/user';
import {verifyUser} from '../middlewares/auth';

const router = Router();

router.post('/register', controller.register);

router.post('/login', controller.login);

router.patch('/account-info', verifyUser, controller.updateAccount);

router.post('/password-reset-mail', controller.sendPasswordResetMail);

router.post('/verify-password-reset', controller.verifyPasswordResetCode);

router.put('/change-password', verifyUser, controller.changePassword);

router.post('/verify-email', controller.verifyEmail);

// router.get('/resend-email-verify-code', controller.resendVerificationCode);

export default router;
