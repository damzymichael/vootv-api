import {cleanEnv, email, port, str} from 'envalid';

export default cleanEnv(process.env, {
  PORT: port(),
  JWT_SECRET: str(),
  ADMIN_EMAIL: email(),
  ADMIN_PASSWORD: str(),
  GOOGLE_DRIVE_CLIENT_EMAIL: str(),
  GOOGLE_DRIVE_SECRET_KEY: str(),
  CLOUD_NAME: str(),
  CLOUD_API_KEY: str(),
  CLOUD_API_SECRET: str()
});
