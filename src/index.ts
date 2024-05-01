import app, {devMode} from './app.config';
import mongoose from 'mongoose';
import env from './util/env';

const DB_URI = devMode ? 'mongodb://localhost:27017/vootv' : env.DB_URI;
const PORT = env.PORT;

mongoose
  .connect(DB_URI)
  .then(() => app.listen(PORT, () => console.log('Listening on PORT ' + PORT)))
  .catch(error => console.error(error));
