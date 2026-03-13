import { RESPONSE_MESSAGE_METADATA } from "@cocrepo/decorator";
import { RESPONSE_EXTRA_KEYS, ResponseEntity } from "@cocrepo/entity";
import {
	type CallHandler,
	type ExecutionContext,
	HttpStatus,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";
import { Observable, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { isWrappedResponse } from "../util/response.util";
import { I18nTranslationService } from "@cocrepo/service";

@Injectable()
export class ResponseEntityInterceptor implements NestInterceptor {
	constructor(
		private readonly reflector: Reflector,
		private readonly translationService: I18nTranslationService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const handler = context.getHandler();
		const classRef = context.getClass();
		const httpResponse = context.switchToHttp().getResponse();

		const defaultStatus =
			this.reflector.get<number>(HTTP_CODE_METADATA, handler) ??
			this.reflector.get<number>(HTTP_CODE_METADATA, classRef) ??
			httpResponse?.statusCode ??
			HttpStatus.OK;

		const messageFromMetadata =
			this.reflector.get<string>(RESPONSE_MESSAGE_METADATA, handler) ??
			this.reflector.get<string>(RESPONSE_MESSAGE_METADATA, classRef);

		return next.handle().pipe(
			switchMap(async (value) => {
				// NO_CONTENT(204) 처리 - body 전송 안함
				if (defaultStatus === HttpStatus.NO_CONTENT) {
					return undefined;
				}

				if (value instanceof ResponseEntity) {
					return value;
				}

				let data = value;
				let meta: unknown;
				let message = messageFromMetadata;
				let status = defaultStatus;
				const extras: Record<string, unknown> = {};

				if (isWrappedResponse(value)) {
					data = value.data;
					meta = value.meta;
					message = value.message ?? message;
					status = value.status ?? status;

					// 확장 필드 분해
					for (const key of RESPONSE_EXTRA_KEYS) {
						if (value[key] !== undefined) {
							extras[key] = value[key];
						}
					}
				} else if (
					value &&
					typeof value === "object" &&
					!Array.isArray(value) &&
					("data" in (value as Record<string, unknown>) ||
						"meta" in (value as Record<string, unknown>) ||
						"message" in (value as Record<string, unknown>) ||
						"status" in (value as Record<string, unknown>) ||
						"httpStatus" in (value as Record<string, unknown>) ||
						// 확장 필드 키도 체크
						RESPONSE_EXTRA_KEYS.some(
							(key) => key in (value as Record<string, unknown>),
						))
				) {
					const record = value as Record<string, unknown>;
					if (record.data !== undefined) {
						data = record.data;
					}

					if (record.meta !== undefined) {
						meta = record.meta;
					}

					if (typeof record.message === "string") {
						message = record.message;
					}

					const explicitStatus = record.status ?? record.httpStatus;
					if (typeof explicitStatus === "number") {
						status = explicitStatus;
					}

					// 확장 필드 분해
					for (const key of RESPONSE_EXTRA_KEYS) {
						if (record[key] !== undefined) {
							extras[key] = record[key];
						}
					}
				}

				// 메시지 번역
				if (!message) {
					const defaultKey =
						status === HttpStatus.CREATED ? "common.created" : "common.success";
					message = await this.translationService.translate(defaultKey);
				} else {
					// 메시지가 번역 키인 경우 번역
					message = await this.translationService.translate(message);
				}

				// 확장 필드가 있으면 extras로 전달
				const hasExtras = Object.keys(extras).length > 0;
				return new ResponseEntity(
					status,
					message,
					data,
					meta as never,
					hasExtras ? (extras as never) : undefined,
				);
			}),
		);
	}
}
