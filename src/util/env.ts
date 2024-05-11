import {cleanEnv, email, port, str} from 'envalid';

export default cleanEnv(process.env, {
  PORT: port(),
  JWT_SECRET: str(),
  ADMIN_EMAIL: email(),
  ADMIN_PASSWORD: str(),
  CLOUD_NAME: str(),
  CLOUD_API_KEY: str(),
  CLOUD_API_SECRET: str()
});
