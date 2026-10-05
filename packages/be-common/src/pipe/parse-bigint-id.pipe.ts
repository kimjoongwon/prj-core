import { type DatabaseId, parseDecimalId } from "@cocrepo/type";
import {
	BadRequestException,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";

const BIGINT_ID_VALIDATION_MESSAGE =
	"Validation failed (canonical positive bigint ID string is expected)";

/**
 * 경로 파라미터의 decimal ID 문자열을 bigint로 변환합니다.
 */
@Injectable()
export class ParseBigIntIdPipe implements PipeTransform<string, DatabaseId> {
	/**
	 * 유효한 decimal ID 문자열은 bigint로 반환하고, 잘못된 값은 400 오류로 거부합니다.
	 *
	 * @param value 검증할 경로 파라미터 문자열
	 * @returns bigint 데이터베이스 ID
	 */
	transform(value: string): DatabaseId {
		const parsedId = parseDecimalId(value);

		if (parsedId === null) {
			throw new BadRequestException(BIGINT_ID_VALIDATION_MESSAGE);
		}

		return parsedId;
	}
}
