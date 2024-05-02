import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface ServiceBody {
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
  locationId: string;
}

export default Controller({
  async addService(req: Request<{}, {}, ServiceBody>, res) {
    const {theme, day} = req.body;
    const serviceExists = await prisma.service.findUnique({
      where: {theme_day: {theme, day}}
    });
    //TODO Check if location of locationId exists
    if (serviceExists)
      throw createHttpError(403, 'Service exists, update to continue');

    await prisma.service.create({data: req.body});

    return res.status(201).send('Service added');
  }
});
