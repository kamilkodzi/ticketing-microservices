import exppress from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { singinRouter } from './routes/signin';
import { singoutRouter } from './routes/signout';
import { singupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@katicketing/common';

const app = exppress();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(singinRouter);
app.use(singoutRouter);
app.use(singupRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
