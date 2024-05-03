import {Router} from 'express';
import controller from '../controllers/user';
import {authenticate, verifyUser, logout} from '../middlewares/auth';

const router = Router();

router.use(logout);

router.post('/register', controller.register);

router.post('/login', controller.login);

router.patch('/account-info', authenticate.user, controller.updateAccount);

router.post('/password-reset-mail', controller.sendPasswordResetMail);

router.post('/verify-password-reset', controller.verifyPasswordResetCode);

router.put('/reset-password', verifyUser, controller.changePassword);

router.post('/verify-email', verifyUser, controller.verifyEmail);

// router.get('/resend-email-verify-code', controller.resendVerificationCode);

router.get('/logout', controller.logout);

export default router;
