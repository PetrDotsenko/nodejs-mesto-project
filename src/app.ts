import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes';
import reqUser from './middlewares/reqUser';
import notFound from './middlewares/notFound';
import errorHandler from './middlewares/errorHandler';

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err);
  });

// Временная авторизация (хардкод пользователя) — как в ТЗ
app.use(reqUser);

// Роуты
app.use('/', routes);

// 404
app.use(notFound);

// Централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

export default app;
