import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
	reason = 'Error connecting to database';
	statusCode = 500;
	constructor() {
		super('Invalid request parametes');

		// Only because we are extending a build in class
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
