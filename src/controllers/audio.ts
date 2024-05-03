import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import {authorize, uploadFile} from '../util/googleDrive';
import {Request} from 'express';
import prisma from '../util/db.connection';

interface Audio {
  timeRecorded: Date;
  preacher: string;
}

export default Controller({
  async addAudio(req: Request<{}, {}, Audio>, res) {
    //Attach information in form
    const {preacher, timeRecorded} = req.body;

    if (!req.file) throw createHttpError(403, 'No file received');
    // Get the uploaded file buffer and name
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const authClient = await authorize();

    // Upload the file to Google Drive
    const response = await uploadFile(
      authClient,
      fileBuffer,
      fileName,
      mimeType
    );

    if (response.status >= 400) {
      throw createHttpError(400, 'Error occured while uploading file');
    }

    const link = `https://drive.google.com/open?id=${response.data.id}`;

    const minusOneMonth = new Date(
      new Date().getTime() - 35 * 24 * 60 * 60 * 1000
    );

    await prisma.audio.create({
      data: {link, preacher, timeRecorded: minusOneMonth}
    });

    res.status(201).json('Audio created');
  },

  async deleteAudio() {}
});
