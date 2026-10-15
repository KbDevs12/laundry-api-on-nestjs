import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';

@Catch(HttpException, ZodError)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | ZodError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string | string[];

    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.issues.map((issue) => {
        return `${issue.path.join('.')}: ${issue.message}`;
      });
    } else {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const body = exceptionResponse as {
          message?: string | string[];
        };

        message = body.message ?? exception.message;
      }
    }

    response.status(status).json({
      errors: message,
    });
  }
}
