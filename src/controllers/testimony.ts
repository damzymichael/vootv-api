import {Request} from 'express';
import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface Testimony {
  title: string;
  content: string;
}

export default Controller({
  async addTestimony(req: Request<{}, {}, Testimony>, res) {
    
    await prisma.testimony.create({
      data: {...req.body, userId: req.user.id}
    });

    return res.status(201).send('Testimony added');
  },

  async getTestimonies(req, res) {
    const testimonies = await prisma.testimony.findMany();

    return res.status(201).json(testimonies);
  },

  async getTestimony(req: Request<{id: string}>, res) {
    const {id} = req.params;
    
    const testimony = await prisma.testimony.findUnique({where: {id}});

    if (!testimony) throw createHttpError(404, 'Testimony not found');

    return res.status(200).json(testimony);
  }
});
