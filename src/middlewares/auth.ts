import createHttpError from 'http-errors';
import prisma from '../util/db.connection';
import {asyncWrapper, Controller} from '../util/requestHandler.config';
import {Request} from 'express';

const logout = asyncWrapper(async (req, res, next) => {
  req.logout = async () => {
    const {authorization} = req.headers;

    const token =
      authorization?.split(' ')[1] || req.signedCookies['rcn.session.token'];

    if (!token) return true;

    const authToken = await prisma.authToken.findUnique({where: {token}});

    if (!authToken) return true;

    await prisma.authToken.delete({where: {token: authToken.token}});

    res.clearCookie('rcn.session.token');

    return true;
  };
  next();
});

type ID = {userId: string};

type MiddlewareRequest = Request<ID, {}, ID>;

/**Checks request body or params and verifies user */
const verifyUser = asyncWrapper(async (req: MiddlewareRequest, res, next) => {
  const userId = req.body.userId || req.params.userId;

  if (!userId) throw createHttpError(403, 'Invalid ID');

  const user = await prisma.user.findUnique({where: {id: userId}});

  if (!user) throw createHttpError(404, 'User not found');

  req.user = user;

  next();
});

/**Authenticates user or admin through headers in request or cookie for admin */
const authenticate = Controller({
  async user(req, res, next) {
    const {authorization} = req.headers;

    const token = authorization?.split(' ')[1];

    if (!token) throw createHttpError(401, 'Unauthorized');

    const authToken = await prisma.authToken.findUnique({where: {token}});

    if (!authToken) throw createHttpError(401, 'Session expired');

    const user = await prisma.user.findUnique({where: {id: authToken.userId}});

    if (!user) throw createHttpError(404, 'User not found');

    const twoWeeks = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);

    await prisma.authToken.update({
      where: {token: authToken.token},
      data: {expiresAt: twoWeeks}
    });

    req.user = user;

    next();
  },

  admin: async (req: Request<{}, {}, {}, {admin: string}>, res, next) => {
    const token = req.signedCookies['rcn.session.token'];

    if (!token) throw createHttpError(401, 'Unauthorized, no token');

    const authToken = await prisma.authToken.findUnique({where: {token}});

    if (!authToken) {
      res.clearCookie('rcn.session.token', {
        signed: true,
        sameSite: 'none',
        secure: true,
        httpOnly: true
      });

      throw createHttpError(401, 'Session expired');
    }

    const user = await prisma.user.findUnique({where: {id: authToken.userId}});

    if (!user) throw createHttpError(401, 'User not found');

    if (user.role != 'ADMIN')
      throw createHttpError(401, 'Unauthorized, not an admin');

    const twoWeeks = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);

    await prisma.authToken.update({
      where: {token: authToken.token},
      data: {expiresAt: twoWeeks}
    });

    if (req.query.admin) return res.status(200).send('Authenticated');

    req.user = user;

    next();
  }
});

export {verifyUser, authenticate, logout};
