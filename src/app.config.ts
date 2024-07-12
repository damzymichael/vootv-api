import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import createHttpError, {isHttpError} from 'http-errors';
import userRoutes from './routes/user';
import audioRoutes from './routes/audio';
import locationRoutes from './routes/location';
import serviceRoutes from './routes/service';
import testimonyRoutes from './routes/testimony';
import streamRoutes from './routes/stream';
import downloadRoutes from './routes/download';
import programRoutes from './routes/program';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {version} from '../package.json';
import path from 'path';
import testRoutes from './test';
import env from './util/env';

const homeMessage = `
<div style="display: flex; align-items: center; justify-content: center; height: 90vh"> 
<h1 style="font-size: 72px; background: -webkit-linear-gradient(45deg, #09009f, #00ff95 80%); -webkit-background-clip: text;
-webkit-text-fill-color: transparent;">VOO TV REST API</h1>
</div>
`;

const app = express();

app.use(helmet());

app.use(morgan('dev'));

app.use(cors({origin: [env.ADMIN_CLIENT_URL], credentials: true}));

app.use(cookieParser(env.COOKIE_SECRET));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.status(200).send(homeMessage));

app.use((req, res, next) => {
  console.log(path.resolve(__dirname, './swagger-docs/users.yaml'));
  next();
});

app.use('/user', userRoutes);
app.use('/audio', audioRoutes);
app.use('/location', locationRoutes);
app.use('/service', serviceRoutes);
app.use('/testimony', testimonyRoutes);
app.use('/stream', streamRoutes);
app.use('/download', downloadRoutes);
app.use('/program', programRoutes);

//? FOR TESTS
app.use('/tests', testRoutes);

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voice of one TV API',
      version
    },
    servers: [
      {url: 'https://vootv-api.vercel.app', description: 'Production server'}
    ]
  },

  apis: [
    path.resolve(__dirname, './swagger-docs/users.yaml'),
    path.resolve(__dirname, './swagger-docs/testimonies.yaml')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  '/api-docs',
  express.static(path.join(__dirname, 'node_modules/swagger-ui-dist'))
);

//Not found
app.use((req, res, next) => next(createHttpError(404, 'Endpoint not found')));

//Error Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  //Todo Handle prisma invalid id error
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json(errorMessage);
});

export default app;
