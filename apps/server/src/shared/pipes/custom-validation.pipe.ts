import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      transformOptions: { enableImplicitConversion: true },
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    console.log('00value00', value);
    if (value && value.content) {
      const { content, ...rest } = value;
      const result = await super.transform(rest, metadata);
      console.log('content', content);
      console.log('content', result);
      return { ...result, content: JSON.parse(content) };
    }
    return super.transform(value, metadata);
  }
}
