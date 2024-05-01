import {google} from 'googleapis';
import {JWT} from 'google-auth-library';
import {Readable} from 'stream';
import env from './env';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export async function authorize(): Promise<JWT> {
  const jwtClient = new google.auth.JWT(
    env.GOOGLE_DRIVE_CLIENT_EMAIL,
    null,
    env.GOOGLE_DRIVE_SECRET_KEY.replace(/\\n/g, '\n'), // Adjust newline characters
    SCOPES
  );

  await jwtClient.authorize();
  return jwtClient;
}

export async function uploadFile(
  authClient: JWT,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) {
  const drive = google.drive({version: 'v3', auth: authClient});

  const readableStream = Readable.from(fileBuffer);

  const file = await drive.files.create({
    requestBody: {
      name: fileName, // File name on Google Drive
      parents: ['1fi7fW0b3gW7-vS30KfgTLqW87l23cFnZ'] // id of folder on google drive
    },
    media: {
      mimeType, // You can specify the MIME type if needed
      body: readableStream
    },
    fields: 'id'
  });

  // Log the file ID
  return file;
}
