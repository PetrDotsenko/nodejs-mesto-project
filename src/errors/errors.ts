import {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_FORBIDDEN,
  STATUS_INTERNAL,
  STATUS_UNAUTHORIZED,
  STATUS_CONFLICT,
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

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message = 'Unauthorized') {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED;
  }
}

export class ConflictError extends Error {
  statusCode: number;
  constructor(message = 'Conflict') {
    super(message);
    this.statusCode = STATUS_CONFLICT;
  }
}
