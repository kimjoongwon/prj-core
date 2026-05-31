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
			const valueWithoutContent = { ...value };
			delete valueWithoutContent.content;
			const result = await super.transform(valueWithoutContent, metadata);
			return { ...result, content: JSON.parse(value.content) };
		}
		return super.transform(value, metadata);
	}
}
