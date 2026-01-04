import { ArgumentMetadata, ValidationPipe } from "@nestjs/common";

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
		if (value?.content) {
			const { content, ...rest } = value;
			const result = await super.transform(rest, metadata);
			return { ...result, content: JSON.parse(content) };
		}
		return super.transform(value, metadata);
	}
}
