import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface Testimony {}

export default Controller({
  async addTestimony(req: Request<{id: string}, {}, Testimony>, res) {
    req.user
  }
});
