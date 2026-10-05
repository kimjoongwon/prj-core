import { DECIMAL_ID_PATTERN } from "@cocrepo/type/database-id";
import { IsNotEmpty, IsOptional, Matches } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface DecimalIdDecoratorOptions {
	/** 필수 여부입니다. */
	required?: boolean;
	/** 배열 요소마다 검증할지 여부입니다. */
	each?: boolean;
}

/**
 * 프론트엔드와 백엔드 wire 경계가 공유하는 canonical decimal ID 검증 데코레이터입니다.
 */
export function DecimalId(
	options: DecimalIdDecoratorOptions = {},
): PropertyDecorator {
	const { required = true, each = false } = options;
	const decorators: PropertyDecorator[] = [
		Matches(DECIMAL_ID_PATTERN, {
			each,
			message: VALIDATION_MESSAGES.DECIMAL_ID_FORMAT,
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

/** 값이 제공된 경우에만 canonical decimal ID를 검증합니다. */
export function DecimalIdOptional(
	options: Omit<DecimalIdDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return DecimalId({ ...options, required: false });
}
