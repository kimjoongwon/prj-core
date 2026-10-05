import {
	BadRequestException,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

/**
 * 경로 파라미터가 정규 ULID인지 검증합니다.
 */
@Injectable()
export class ParseUlidPipe implements PipeTransform<string, string> {
	/**
	 * 유효한 ULID는 그대로 반환하고, 잘못된 값은 400 오류로 거부합니다.
	 */
	transform(value: string): string {
		if (!ULID_PATTERN.test(value)) {
			throw new BadRequestException("Validation failed (ULID is expected)");
		}

		return value;
	}
}
