import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import Service from '../models/service';

interface ServiceBody {
  day: string;
  startTime: string;
  endTime: string;
  theme: string;
  locationId: string;
}

export default Controller({
  async addService(req: Request<{}, {}, ServiceBody>, res) {
    const serviceExists = await Service.findOne({theme: req.body.theme});
    //TODO Check if location of locationId exists
    if (serviceExists)
      throw createHttpError(403, 'Service exists, update to continue');

    await Service.create(req.body);

    return res.status(201).send('Service added');
  },
  async getLocationServices(req: Request<{locationId: string}>, res) {
    const services = await Service.find({locationId: req.params.locationId});

    return res.status(200).json(services);
  }
});
