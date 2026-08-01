import { IsNotEmpty, IsOptional, Matches } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export interface ULIDDecoratorOptions {
	/** 필수 여부입니다. */
	required?: boolean;
	/** 배열 요소마다 검증할지 여부입니다. */
	each?: boolean;
}

/**
 * 프론트엔드와 백엔드가 공유하는 ULID 검증 데코레이터입니다.
 */
export function ULID(options: ULIDDecoratorOptions = {}): PropertyDecorator {
	const { required = true, each = false } = options;
	const decorators: PropertyDecorator[] = [
		Matches(ULID_PATTERN, {
			each,
			message: VALIDATION_MESSAGES.ULID_FORMAT,
		}),
	];

	if (required) {
		decorators.push(
			IsNotEmpty({ each, message: VALIDATION_MESSAGES.REQUIRED }),
		);
	} else {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}

/**
 * 값이 제공된 경우에만 ULID를 검증합니다.
 */
export function ULIDOptional(
	options: Omit<ULIDDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return ULID({ ...options, required: false });
}
