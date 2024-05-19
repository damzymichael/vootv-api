import {Controller} from '../util/requestHandler.config';
import {Request} from 'express';
import createHttpError from 'http-errors';
import prisma from '../util/db.connection';
import {uploadBuffer, cloudinary} from '../util/cloudinary.config';

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
  },

  async updateProgram() {
    //Todo Delete file in cloudinary if a file is sent
  },

  async deleteProgram(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const program = await prisma.program.findUnique({where: {id}});

    if (!program) throw createHttpError(404, 'Audio not found');

    const deleted = await prisma.program.delete({where: {id: program.id}});

    if (!deleted)
      throw createHttpError('Could not delete program, try again later');

    await cloudinary.uploader.destroy(deleted.banner.public_id, {
      invalidate: true,
      resource_type: 'image'
    });
    // {result: 'not found'; }| {  result: 'ok';}

    return res.status(200).json('Program deleted');
  }
});
