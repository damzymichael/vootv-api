import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import createHttpError, {isHttpError} from 'http-errors';
import userRoutes from './routes/user';
import audioRoutes from './routes/audio';
import locationRoutes from './routes/location';
import serviceRoutes from './routes/service';
import testimonyRoutes from './routes/testimony';
import testRoutes from './test';

const homeMessage = `
  <div style="display: flex; align-items: center; justify-content: center; height: 90vh"> 
    <h1 style="font-size: 72px; background: -webkit-linear-gradient(45deg, #09009f, #00ff95 80%); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;">VOO TV REST API</h1>
  </div>
`;

const app = express();

app.use(helmet());

export const devMode = app.get('env') === 'development';

export const BASE_URL = devMode ? 'http://localhost:5000/vootv' : '';

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.status(200).send(homeMessage));
app.use('/user', userRoutes);
app.use('/audio', audioRoutes);
app.use('/location', locationRoutes);
app.use('/service', serviceRoutes);
app.use('/testimony', testimonyRoutes);

//? FOR TESTS
app.use('/tests', testRoutes);

//Not found
app.use((req, res, next) => next(createHttpError(404, 'Endpoint not found')));

//Error Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json(errorMessage);
});

export default app;
