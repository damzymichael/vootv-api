import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';
import {uploadBuffer} from '../util/cloudinary.config';

type ProgramType = 'PROGRAM' | 'EVENT';
interface Program {
  theme: string;
  startTime: Date;
  endTime: Date;
  ministers: string[];
  type: ProgramType;
}

export default Controller({
  async addProgram(req: Request<{}, {}, Program, {locationId: string}>, res) {
    const {locationId} = req.query;

    if (!locationId) throw createHttpError(403, 'No location ID');

    if (!req.file) {
      throw createHttpError(403, 'No Image added');
    }

    const {buffer} = req.file;

    const response = await uploadBuffer(buffer, 'image', 'vootv-api/banners');

    const {secure_url, public_id} = response

    await prisma.program.create({data: {...req.body, banner: {secure_url, public_id}, locationId}})

    return res.status(202).send('Program Added successfully')
  },

  async getPrograms(req: Request<{}, {}, {}, {type: ProgramType}>, res) {
    const {type} = req.query;

    if (type != 'PROGRAM' && type != 'EVENT')
      throw createHttpError(403, 'Invalid type');

    const programs = await prisma.program.findMany({where: {type}});

    return res.status(200).json(programs);
  },

  async getProgram(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const program = await prisma.program.findUnique({where: {id}});

    return res.status(200).json(program);
  }
});
