import { ArgumentMetadata, ValidationPipe } from "@nestjs/common";

interface ContentPayload extends Record<string, unknown> {
	content?: unknown;
}

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

	async transform(
		value: unknown,
		metadata: ArgumentMetadata,
	): Promise<unknown> {
		const content =
			value !== null && typeof value === "object" && "content" in value
				? (value as ContentPayload).content
				: undefined;

		if (
			value !== null &&
			typeof value === "object" &&
			"content" in value &&
			typeof content === "string" &&
			content
		) {
			const valueWithoutContent = { ...value };
			delete valueWithoutContent.content;
			const result = await super.transform(valueWithoutContent, metadata);
			return {
				...(result as Record<string, unknown>),
				content: JSON.parse(content),
			};
		}
		return super.transform(value, metadata);
	}
}
