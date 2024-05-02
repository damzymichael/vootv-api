import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import {hash, compare} from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../models/user';
import VerificationCode from '../models/user_verification_code';
import crypto from 'crypto';
import {default_transporter} from '../util/nodemailer.config';
import prisma from '../util/db.connection';

interface Register {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

interface Verify {
  code: string;
  userId: string;
}

type ResetPasswordMail = Pick<Register, 'email'>;

type ChangePassword = {password: string; userId: string};

type Login = Pick<Register, 'email' | 'password'>;

//TODO Refactor finding user into middleware
export default Controller({
  async register(req: Request<{}, {}, Register>, res) {
    const {email, password, phoneNumber} = req.body;

    const exists = await prisma.user.findFirst({
      where: {OR: [{email}, {phoneNumber}]}
    });

    if (exists)
      throw createHttpError(403, 'Account already exists, please login');

    const hashedPW = await hash(password, 10);

    //* Add role of user by default
    const user = await prisma.user.create({
      data: {...req.body, password: hashedPW, role: 'USER'}
    });

    const {email: _email, id} = user;

    const rand = crypto.randomInt(1000, 9999).toString();

    const userCode = await prisma.verficationCode.create({
      data: {
        userId: id,
        code: rand,
        action: 'EMAIL_VERIFICATION'
      }
    });

    const mailResponse = await default_transporter.sendMail({
      from: 'RCN Global Network',
      to: user.email,
      subject: 'Email verification code',
      html: `<p>This is your verification code. It will expire in 15 minutes.</p><strong>${userCode.code}</strong>`,
      replyTo: 'noreply@rcn.com'
    });

    return res.status(200).json({
      message: 'Verification code sent to email address',
      userId: id
    });
  },
  async verifyEmail(req: Request<any, any, Verify>, res) {
    const {code, userId} = req.body;

    const user = await User.findById(userId);

    if (!user) throw createHttpError(404, 'User not found');

    const codeExists = await VerificationCode.findOne({
      userId,
      action: 'email-verification'
    });

    if (!codeExists)
      throw createHttpError(403, 'Code expired, request new code');

    if (codeExists.otp !== code)
      throw createHttpError(403, 'Invalid code, retry');

    await User.findByIdAndUpdate(user._id, {
      emailVerified: true
    });

    await codeExists.deleteOne();

    return res.status(200).send('Email verification successful');
  },
  //TODO Implement resending verification email flow
  async resendVerificationCode(req, res) {
    const date15MinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    //Return a document that was created over 15 mins ago
    const user = await User.findOne({
      createdAt: {$lt: date15MinutesAgo}
    });

    return res.status(200).json(user);
  },
  //TODO Implement session here
  async login(req: Request<any, any, Login>, res) {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) throw createHttpError(403, 'Invalid email or password');

    const validPassword = await compare(password, user.password);

    if (!validPassword) throw createHttpError(403, 'Invalid email or password');

    return res.status(200).json('Log in success');
  },
  async sendPasswordResetMail(req: Request<any, any, ResetPasswordMail>, res) {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) throw createHttpError(403, 'User not found');

    const rand = crypto.randomInt(1000, 9999).toString();

    const userCode = await VerificationCode.create({
      userId: user._id,
      otp: rand,
      action: 'password-reset'
    });

    if (!userCode)
      throw createHttpError(403, 'Could not create verification code');

    const mailResponse = await default_transporter.sendMail({
      from: 'RCN Global Network',
      to: user.email,
      subject: 'Password reset code',
      html: `<p>This is your password reset code. It expires in 15 minutes.</p><strong>${userCode.otp}</strong>`,
      replyTo: 'noreply@rcn.com'
    });

    return res
      .status(200)
      .json('Check your email for your password reset code');
  },
  async verifyPasswordResetCode(req: Request<any, any, Verify>, res) {
    const {code, userId} = req.body;

    const userCode = await VerificationCode.findOne({
      otp: code,
      userId,
      action: 'password-reset'
    });

    if (!userCode) throw createHttpError(403, 'Code expired, request new code');

    if (code !== userCode.otp)
      throw createHttpError(403, 'Invalid code, try again');

    return res.status(200).json('Verified');
  },
  async changePassword(req: Request<any, any, ChangePassword>, res) {
    const {password, userId} = req.body;

    const user = await User.findById(userId);

    if (!user) throw createHttpError(403, 'User not found');

    const hashedPW = await hash(password, 10);

    await User.updateOne({_id: user.id}, {password: hashedPW});

    return res.status(200).json('Password changed');
  }
});
