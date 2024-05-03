import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import {hash, compare} from 'bcryptjs';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import {v4} from 'uuid';
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

  async verifyEmail(req: Request<{}, {}, Verify>, res) {
    const {code} = req.body;

    const {id} = req.user;

    const codeExists = await prisma.verficationCode.findUnique({
      where: {userId_action: {userId: id, action: 'EMAIL_VERIFICATION'}}
    });

    if (!codeExists)
      throw createHttpError(403, 'Code expired, request new code');

    if (codeExists.code !== code)
      throw createHttpError(403, 'Invalid code, retry');

    await prisma.user.update({
      where: {id},
      data: {emailVerified: true}
    });

    await prisma.verficationCode.delete({where: {id: codeExists.id}});

    return res.status(200).send('Email verification successful');
  },

  //TODO Implement resending verification email flow
  async resendVerificationCode(req, res) {
    return res.status(200).json('Okay');
  },

  async login(req: Request<{}, {}, Login>, res) {
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({where: {email}});

    if (!user) throw createHttpError(403, 'Invalid email or password');

    const validPassword = await compare(password, user.password);

    if (!validPassword) throw createHttpError(403, 'Invalid email or password');

    if (!user.emailVerified)
      throw createHttpError(403, 'Please verify your email');

    const token = v4();
    const twoWeeks = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);
    //Todo Change to create and delete token during signout process
    //Authentication token to expire after two weeks
    //? Create or update an existing token for testing purposes
    const authToken = await prisma.authToken.upsert({
      where: {userId: user.id},
      create: {
        userId: user.id,
        token,
        expiresAt: twoWeeks
      },
      update: {expiresAt: twoWeeks}
    });

    res.setHeader('Authorization', `Bearer ${authToken.token}`);

    const {password: _, emailVerified, role, updatedAt, ...rest} = user;

    return res.status(200).json({message: 'Log in success', user: rest});
  },

  async sendPasswordResetMail(req: Request<{}, {}, ResetPasswordMail>, res) {
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

    return res.status(200).json('Password reset code sent to your mail');
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
    const {password} = req.body;

    const {id} = req.user;

    const hashedPW = await hash(password, 10);

    await prisma.user.update({where: {id}, data: {password: hashedPW}});

    return res.status(200).json('Password changed');
  },

  //Todo Improve this function for images and others
  async updateAccount(req: Request<{}, {}, UserSchema>, res) {
    const {id} = req.user;

    await prisma.user.update({where: {id}, data: req.body});

    return res.status(200).json('Account details updated');
  },

  async logout(req, res) {
    await req.logout();

    res.status(200).send('Logout successful');
  }
});
