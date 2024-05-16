import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';
import {uploadBuffer} from '../util/cloudinary.config';

type ProgramType = 'PROGRAM' | 'EVENT';
interface Program {
  locationId: string;
  theme: string;
  startTime: Date;
  endTime: Date;
  additionalInfo: string;
  type: ProgramType;
}

export default Controller({
  async addProgram(req: Request<{}, {}, Program>, res) {
    req.body.startTime = new Date(req.body.startTime);
    req.body.endTime = new Date(req.body.endTime);

    if (!req.file) {
      throw createHttpError(403, 'No Image added');
    }

    const {buffer} = req.file;

    const response = await uploadBuffer(buffer, 'image', 'vootv-api/banners');

    const {secure_url, public_id} = response;

    await prisma.program.create({
      data: {...req.body, banner: {secure_url, public_id}}
    });

    return res.status(201).send('Program Added successfully');
  },

  async getPrograms(req, res) {
    const programs = await prisma.program.findMany({
      include: {location: {select: {state: true, country: true}}}
    });

    return res.status(200).json(programs);
  },

  async getProgram(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const program = await prisma.program.findUnique({where: {id}});

    return res.status(200).json(program);
  }
});
