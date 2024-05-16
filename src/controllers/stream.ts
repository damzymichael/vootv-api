import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface Stream {
  userId: string;
  audioId: string;
  duration: number;
}

export default Controller({
  async addStream(req: Request<{}, {}, Stream>, res) {
    await prisma.stream.create({data: req.body});
    
    return res.status(201).send('Stream added');
  }
});
