import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';
import winston from 'winston';
import { errors as celebrateErrors, celebrate } from 'celebrate';

import routes from './routes';
import auth from './middlewares/auth';
import notFound from './middlewares/notFound';
import errorHandler from './middlewares/errorHandler';

import {
  createUser,
  login,
} from './controllers/users';

import { signupValidation, signinValidation } from './validators';

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
  meta: true,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false,
}));

app.post('/signup', celebrate(signupValidation), createUser);
app.post('/signin', celebrate(signinValidation), login);

app.use(auth);

app.use('/', routes);

app.use(notFound);

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
}));

app.use(celebrateErrors());

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
