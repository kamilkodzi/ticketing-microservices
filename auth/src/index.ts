import exppress from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { singinRouter } from './routes/singin';
import { singoutRouter } from './routes/singout';
import { singupRouter } from './routes/singup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = exppress();
app.use(json());

app.use(currentUserRouter);
app.use(singinRouter);
app.use(singoutRouter);
app.use(singupRouter);
app.all('*', async (req, res) => {
	throw new NotFoundError();
});
app.use(errorHandler);

app.listen(3000, () => {
	console.log('Listen on port 3000');
});
