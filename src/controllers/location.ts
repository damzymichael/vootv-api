import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';
interface LocationBody {
  country: string;
  state: string;
  address: string;
  pastorInCharge: string;
  mapLocation?: {longitude: number; latitude: number};
}

export default Controller({
  async addLocation(req: Request<{}, {}, LocationBody>, res) {
    const {country, state, pastorInCharge} = req.body;

    const locationExists = await prisma.location.findUnique({
      where: {country_state_pastorInCharge: {country, state, pastorInCharge}}
    });

    if (locationExists) throw createHttpError(403, 'Location exists');

    await prisma.location.create({data: req.body});

    return res.status(201).send('New location added');
  },

  async getLocations(req, res) {
    const locations = await prisma.location.findMany();

    return res.status(200).json(locations);
  },

  async getLocation(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const location = await prisma.location.findUnique({
      where: {id},
      include: {services: true}
    });

    if (!location) throw createHttpError('Location does not exist');

    return res.status(200).json(location);
  },

  async updateLocation(req: Request<{id: string}, {}, LocationBody>, res) {
    const {id} = req.params;

    const location = await prisma.location.findUnique({where: {id}});

    if (!location) throw createHttpError(403, 'Location not found');

    await prisma.location.update({where: {id: location.id}, data: req.body});

    return res.status(200).send('Location details updated');
  }
});
