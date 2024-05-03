import createHttpError from 'http-errors';
import prisma from '../util/db.connection';
import {asyncWrapper, Controller} from '../util/requestHandler.config';
import {CustomRequestHandler} from '../util/requestHandler.config';
import {Request} from 'express';

const logout = asyncWrapper(async (req, res, next) => {
  req.logout = async () => {
    const {authorization} = req.headers;

    const token = authorization?.split(' ')[1];

    if (!token) return true;

    const authToken = await prisma.authToken.findUnique({where: {token}});

    if (!authToken) return true;

    await prisma.authToken.delete({where: {token: authToken.token}});

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

type Role = 'USER' | 'ADMIN';

const auth: CustomRequestHandler<Role> = async (req, _, next, role) => {
  const {authorization} = req.headers;

  const token = authorization?.split(' ')[1];

  if (!token) throw createHttpError(401, 'Unauthorized');

  const authToken = await prisma.authToken.findUnique({where: {token}});

  if (!authToken) throw createHttpError(401, 'Session expired');

  const user = await prisma.user.findUnique({where: {id: authToken.userId}});

  if (role === 'USER' && !user) throw createHttpError(404, 'User not found');

  if (role === 'ADMIN' && (!user || user.role !== 'ADMIN')) {
    throw createHttpError(405, 'Not allowed');
  }

  const twoWeeks = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);

  await prisma.authToken.update({
    where: {userId: user.id},
    data: {expiresAt: twoWeeks}
  });

  req.user = user;

  next();
};

/**Authenticates user or admin through headers in request */
const authenticate = Controller({
  async user(req, res, next) {
    await auth(req, res, next, 'USER');
  },

  admin: async (req, res, next) => {
    await auth(req, res, next, 'ADMIN');
  }
});

export {verifyUser, authenticate, logout};
