import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import {uploadBuffer, cloudinary} from '../util/cloudinary.config';
import {Request} from 'express';
import prisma from '../util/db.connection';

interface Audio {
  title: string;
  timeRecorded: Date;
  preacher: string;
}

export default Controller({
  async getAudios(req, res) {
    const audios = await prisma.audio.findMany({
      include: {streams: {select: {id: true}}, downloads: {select: {id: true}}}
    });

    res.status(200).json(audios);
  },

  async getAudio(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const audio = await prisma.audio.findUnique({
      where: {id},
      include: {
        streams: {include: {user: {select: {fullName: true}}}},
        downloads: {include: {user: {select: {fullName: true}}}}
      }
    });

    if (!audio) throw createHttpError("Audio doesn't exist");

    return res.status(200).json(audio);
  },

  //Todo Trim inputs
  async addAudio(req: Request<{}, {}, Audio>, res) {
    //Attach information in form
    const {title, preacher, timeRecorded} = req.body;

    if (!req.file) throw createHttpError(403, 'No file received');

    // Get the uploaded file buffer and name
    const fileBuffer = req.file.buffer;

    const response = await uploadBuffer(fileBuffer, 'auto', 'vootv-api/audios');

    const {secure_url, public_id, bytes} = response;

    await prisma.audio.create({
      data: {
        link: secure_url,
        preacher,
        timeRecorded: new Date(timeRecorded),
        size: bytes,
        cloudId: public_id,
        title
      }
    });

    res.status(201).json('Audio added');
  },

  async deleteAudio(req: Request<{id: string}>, res) {
    const {id} = req.params;

    const audio = await prisma.audio.findUnique({where: {id}});

    if (!audio) throw createHttpError(404, 'Audio not found');

    const audioDeleted = await prisma.audio.delete({where: {id: audio.id}});

    if (!audioDeleted)
      throw createHttpError('Could not delete audio, try again later');

    await cloudinary.uploader.destroy(audioDeleted.cloudId, {
      invalidate: true,
      resource_type: 'video'
    });
    // {result: 'not found'; }| {  result: 'ok';}

    return res.status(200).json('Audio deleted');
  }
});
