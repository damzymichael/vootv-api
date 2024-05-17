import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface Download {
  userId: string;
  audioId: string;
  status: 'COMPLETED' | 'ONGOING' | 'FAILED';
}

export default Controller({
  async addDownload(req: Request<{}, {}, Download>, res) {
    await prisma.download.create({data: req.body});

    res.status(201).send('Download saved');
  }
});
