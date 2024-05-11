import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface ServiceBody {
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
}

export default Controller({
  async addService(req: Request<{locationId: string}, {}, ServiceBody>, res) {
    const {theme, day} = req.body;
    const {locationId} = req.params;

    const location = await prisma.location.findUnique({where: {id: locationId}})

    if(!location) throw createHttpError(404, 'Location not found');

    const serviceExists = await prisma.service.findUnique({
      where: {theme_day: {theme, day}}
    });

    if (serviceExists)
      throw createHttpError(403, 'Service exists, update to continue');

    await prisma.service.create({data: {...req.body, locationId}});

    return res.status(201).send('Service added');
  },
  async updateService() {}
});
