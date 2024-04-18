// import app, {DB_URI} from './app';
import app from './app';
import mongoose from 'mongoose';
// import env from './util/env';

// const PORT = env.PORT;

// mongoose
//   .connect(DB_URI)
//   .then(() => app.listen(5000, () => console.log('Listening on PORT ' + 5000)))
//   .catch(error => console.error(error));

app.listen(5000, () => console.log('Listening on PORT ' + 5000));
