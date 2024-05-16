import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import {hash, compare} from 'bcryptjs';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import {v4} from 'uuid';
import {default_transporter} from '../util/nodemailer.config';
import prisma from '../util/db.connection';
import {cloudinary, uploadBuffer} from '../util/cloudinary.config';

interface UserSchema {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  locationId?: string;
  avi?: {secure_url: string; public_id: string};
}

interface Verify {
  code: string;
  userId: string;
}

type ResetPasswordMail = Pick<UserSchema, 'email'>;

type ChangePassword = {password: string; userId: string};

type Login = Pick<UserSchema, 'email' | 'password'>;

export default Controller({
  async getUsers(req, res) {
    const users = await prisma.user.findMany({where: {role: 'USER'}});

    return res.status(200).json(users);
  },

  async getUser(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const user = await prisma.user.findUnique({
      where: {id},
      include: {location: {select: {state: true}}}
    });

    return res.status(200).json(user);
  },

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

  async login(req: Request<{}, {}, Login, {admin: string}>, res) {
    const {email, password} = req.body;

    const {admin} = req.query;

    const user = await prisma.user.findUnique({where: {email}});

    if (!user) throw createHttpError(403, 'Invalid email or password');

    if (admin == 'true' && user.role != 'ADMIN')
      throw createHttpError(403, 'Unknown Error Occured');

    const validPassword = await compare(password, user.password);

    if (!validPassword) throw createHttpError(403, 'Invalid email or password');

    if (!user.emailVerified)
      throw createHttpError(403, 'Please verify your email');

    const token = v4();
    const twoWeeks = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);

    const exists = await prisma.authToken.findUnique({
      where: {userId: user.id}
    });

    if (exists) await prisma.authToken.delete({where: {id: exists.id}});

    //Authentication token to expire after two weeks
    const authToken = await prisma.authToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: twoWeeks
      }
    });

    const {password: _, emailVerified, role, updatedAt, ...rest} = user;

    //Todo Add other parameters to cookie
    if (user.role == 'ADMIN') {
      return res
        .cookie('rcn.session.token', authToken.token, {
          signed: true,
          maxAge: 1000 * 60 * 60 * 24 * 14
        })
        .status(200)
        .send('Login successful');
    } else {
      res.setHeader('Authorization', `Bearer ${authToken.token}`);
    }

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

  //Todo Add rate mimiter to stop after two requests if uploading image
  async updateAccount(req: Request<{}, {}, UserSchema>, res) {
    const {id} = req.user;

    let data = req.body;

    if (req.file) {
      const {buffer} = req.file;
      if (req.user.avi.public_id) {
        await cloudinary.uploader.destroy(req.user.avi.public_id, {
          invalidate: true
        });
        await prisma.user.update({where: {id}, data: {avi: null}});
      }
      const response = await uploadBuffer(buffer, 'image', 'vootv-api/pfps');
      const {secure_url, public_id} = response;
      data = {...req.body, avi: {secure_url, public_id}};
    }

    await prisma.user.update({where: {id}, data});

    return res.status(200).json('Account details updated');
  },

  async logout(req, res) {
    await req.logout();

    res.status(200).send('Logout successful');
  }
});
