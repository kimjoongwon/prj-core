import { isUuid, tryFromRouteKey } from "@cocrepo/toolkit";
import {
	type ArgumentMetadata,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";

/**
 * URL path param으로 들어온 UUID route key를 controller 진입 전에 UUID로 복원합니다.
 */
@Injectable()
export class RouteKeyToUuidPipe implements PipeTransform {
	transform(value: unknown, metadata: ArgumentMetadata): unknown {
		if (metadata.type !== "param" || typeof value !== "string") {
			return value;
		}

		if (!isIdParam(metadata.data)) {
			return value;
		}

		if (isUuid(value)) {
			return value;
		}

		const uuid = tryFromRouteKey(value);
		return uuid ?? value;
	}
}

function isIdParam(paramName: string | undefined): boolean {
	return paramName === "id" || paramName?.endsWith("Id") === true;
}
