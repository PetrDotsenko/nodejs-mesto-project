import {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_FORBIDDEN,
} from '../constants/statusCodes';

export class BadRequestError extends Error {
  statusCode: number;
  constructor(message = 'Bad Request') {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message = 'Not Found') {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = STATUS_FORBIDDEN;
  }
}
