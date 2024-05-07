import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';

interface Program {
  theme: string;
  startTime: Date;
  endTime: Date;
  ministers: string[];
  type: 'PROGRAM' | 'EVENT';
}

export default Controller({
  async addProgram(req: Request<{}, {}, Program, {locationId: string}>, res) {
    const {locationId} = req.query;

    if (!locationId) throw createHttpError(403, 'No location ID');
  },

  async getPrograms(req, res) {
    const programs = await prisma.program.findMany();

    return res.status(200).json(programs);
  },

  async getProgram(req: Request<{id: string}>, res) {
    const {id} = req.params;
    
    const program = await prisma.program.findUnique({where: {id}});
  }
});
