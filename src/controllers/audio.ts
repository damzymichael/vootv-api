import {Controller} from '../util/requestHandler.config';
import createHttpError from 'http-errors';
import {authorize, uploadFile} from '../util/googleDrive';

export default Controller({
  async addAudio(req, res) {
    if (!req.file) throw createHttpError(403, 'No file received');
    // Get the uploaded file buffer and name
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const authClient = await authorize();

    // Upload the file to Google Drive
    const file = await uploadFile(authClient, fileBuffer, fileName, mimeType);

    console.log(file);

    console.log(file.data);

    res.status(201).send('Okay');
  }
});
