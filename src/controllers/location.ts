import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import Location from '../models/location';

interface LocationBody {
  country: string;
  state: string;
  address: string;
  pastorInCharge: string;
  mapLocation?: string;
}

export default Controller({
  async addLocation(req: Request<{}, {}, LocationBody>, res) {
    const {country, state} = req.body;

    const locationExists = await Location.findOne({country, state});

    if (locationExists) throw createHttpError(403, 'Location added');

    await Location.create(req.body);

    return res.status(201).send('New location added');
  },

  async getLocations(req, res) {
    const locations = await Location.find({}).populate({path: 'services'});

    res.status(200).json(locations);
  },

  async getLocation() {},

  async updateLocation(req: Request<{id: string}, {}, LocationBody>, res) {
    const {id} = req.params;

    const location = await Location.findById(id);

    if (!location) throw createHttpError(403, 'Location not found');

    await location.updateOne(req.body);

    return res.status(200).send('Location details updated');
  }
});
