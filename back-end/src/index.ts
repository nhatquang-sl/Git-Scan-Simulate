import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import ENV from '@config';
import corsOptions from '@config/cors-options';
import { dbContext, initializeDb } from '@database';

import scanRoute from 'controllers/scan-route';
import ScanEventWorker from 'workers/scan-event-worker';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '@application/common/exceptions';

console.log(ENV);

const app = express();

// Cross Origin Resource Sharing
// app.use(cors());
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());

// Middleware function for logging the request method and request URL
const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  console.log(`${request.method} url:: ${request.url}`);
  try {
    next();
  } catch (err) {
    console.log('------------------------------------');
  }
};
app.use(requestLogger);

app.use('/scan', scanRoute);
const router = express.Router();
router.get('/', (req, res) => {
  res.json({
    ENV: ENV.NODE_ENV,
    APP_VERSION: ENV.APP_VERSION,
  });
});
app.use('/', router);

// https://medium.com/@utkuu/error-handling-in-express-js-and-express-async-errors-package-639c91ba3aa2
const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error);
  const { message } = error;
  const data = JSON.parse(message);
  if (error instanceof BadRequestError) return response.status(400).json(data);
  if (error instanceof UnauthorizedError) return response.status(401).json(data);
  if (error instanceof NotFoundError) return response.status(404).json(data);
  if (error instanceof ConflictError) return response.status(409).json(data);
  return response.sendStatus(500);
};
app.use(errorLogger);

dbContext.connect().then(async () => {
  await initializeDb();
  app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
  new ScanEventWorker().run();
});

export default app;
