import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import {hash, compare} from 'bcryptjs';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import {default_transporter} from '../util/nodemailer.config';
import prisma from '../util/db.connection';

interface UserSchema {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  locationId?: string;
}

interface Verify {
  code: string;
  userId: string;
}

type ResetPasswordMail = Pick<UserSchema, 'email'>;

type ChangePassword = {password: string; userId: string};

type Login = Pick<UserSchema, 'email' | 'password'>;

//TODO Refactor finding user into middleware
export default Controller({
  async register(req: Request<{}, {}, UserSchema>, res) {
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

    const otp = await prisma.verficationCode.create({
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
      html: `<p>This is your verification code. It will expire in 15 minutes.</p><strong>${otp.code}</strong>`,
      replyTo: 'noreply@rcn.com'
    });

    return res.status(200).json({
      message: 'Verification code sent to email address',
      userId: id
    });
  },

  async verifyEmail(req: Request<any, any, Verify>, res) {
    const {code, userId} = req.body;

    const user = await prisma.user.findUnique({where: {id: userId}});

    if (!user) throw createHttpError(404, 'User not found');

    const codeExists = await prisma.verficationCode.findUnique({
      where: {userId_action: {userId, action: 'EMAIL_VERIFICATION'}}
    });

    if (!codeExists)
      throw createHttpError(403, 'Code expired, request new code');

    if (codeExists.code !== code)
      throw createHttpError(403, 'Invalid code, retry');

    await prisma.user.update({
      where: {id: user.id},
      data: {emailVerified: true}
    });

    await prisma.verficationCode.delete({where: {id: codeExists.id}});

    return res.status(200).send('Email verification successful');
  },

  //TODO Implement resending verification email flow
  async resendVerificationCode(req, res) {
    return res.status(200).json('Okay');
  },

  //TODO Implement session here
  async login(req: Request<any, any, Login>, res) {
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({where: {email}});

    if (!user) throw createHttpError(403, 'Invalid email or password');

    const validPassword = await compare(password, user.password);

    if (!validPassword) throw createHttpError(403, 'Invalid email or password');

    return res.status(200).json('Log in success');
  },

  async sendPasswordResetMail(req: Request<any, any, ResetPasswordMail>, res) {
    const {email} = req.body;

    const user = await prisma.user.findUnique({where: {email}});

    if (!user) throw createHttpError(403, 'User not found');

    const rand = crypto.randomInt(1000, 9999).toString();

    const otp = await prisma.verficationCode.create({
      data: {
        userId: user.id,
        code: rand,
        action: 'PASSWORD_RESET'
      }
    });

    if (!otp) throw createHttpError(403, 'Could not create verification code');

    const mailResponse = await default_transporter.sendMail({
      from: 'RCN Global Network',
      to: user.email,
      subject: 'Password reset code',
      html: `<p>This is your password reset code. It expires in 15 minutes.</p><strong>${otp.code}</strong>`,
      replyTo: 'noreply@rcn.com'
    });

    return res
      .status(200)
      .json('Check your email for your password reset code');
  },

  async verifyPasswordResetCode(req: Request<{}, {}, Verify>, res) {
    const {code, userId} = req.body;
    const otp = await prisma.verficationCode.findFirst({
      where: {code, userId, action: 'PASSWORD_RESET'}
    });

    if (!otp) throw createHttpError(403, 'Code expired, request new code');

    if (code !== otp.code)
      throw createHttpError(403, 'Invalid code, try again');

    return res.status(200).json('Verified');
  },

  async changePassword(req: Request<{}, {}, ChangePassword>, res) {
    const {password, userId} = req.body;

    const user = await prisma.user.findUnique({where: {id: userId}});

    if (!user) throw createHttpError(403, 'User not found');

    const hashedPW = await hash(password, 10);

    await prisma.user.update({where: {id: userId}, data: {password: hashedPW}});

    return res.status(200).json('Password changed');
  },

  async updateAccount(req: Request<{userId: string}, {}, UserSchema>, res) {
    const {userId} = req.params;

    const user = await prisma.user.findUnique({where: {id: userId}});

    if (!user) throw createHttpError(403, 'User not found');

    await prisma.user.update({where: {id: user.id}, data: req.body});

    return res.status(200).json('Account details updated');
  }
});
