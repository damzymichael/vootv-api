import streamifier from 'streamifier';
import {UploadApiResponse, v2 as cloudinary} from 'cloudinary';
import env from './env';

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
  secure: true
});

// resource_type: 'raw' //to accept other type of files
export type ResourceType = 'image' | 'video' | 'raw' | 'auto';

type UploadBuffer = (
  fileBuffer: Buffer,
  resourceType: ResourceType,
  folder: string
) => Promise<UploadApiResponse>;

const uploadBuffer: UploadBuffer = (fileBuffer, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {folder, resource_type: resourceType},
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export {cloudinary, uploadBuffer};
