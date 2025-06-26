import {
  BadRequestException,
  Injectable,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsMessages = errors.flatMap((err) =>
          Object.values(err.constraints || {}).map((message) => ({
            message,
            field: err.property,
          })),
        );
        return new BadRequestException({ errorsMessages });
      },
    });
  }
}
