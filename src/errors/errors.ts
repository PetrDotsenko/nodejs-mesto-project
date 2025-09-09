export class BadRequestError extends Error {
  statusCode: number;
  constructor(message = 'Bad Request') {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message = 'Not Found') {
    super(message);
    this.statusCode = 404;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = 403;
  }
}
