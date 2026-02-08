import { MASKING_PRESETS } from "@cocrepo/constant";
import { MaskingService } from "@cocrepo/service";
import type { ActionConfig } from "@cocrepo/type";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import type { Actions, AppAbility } from "../casl/types";
import { isWrappedResponse } from "../util/response.util";

/**
 * 마스킹 Subject 메타데이터 키
 */
export const MASKING_SUBJECT_KEY = "maskingSubject";

/**
 * 마스킹 적용 데코레이터
 *
 * @description
 * 컨트롤러 메서드에 적용하여 응답 데이터의 민감한 필드를 마스킹합니다.
 * Subject 이름을 지정하면 해당 Subject에 대한 마스킹 권한을 확인합니다.
 *
 * @param subject - CASL Subject 이름 (예: 'User', 'entity:User')
 *
 * @example
 * ```typescript
 * @Get()
 * @UseInterceptors(MaskingInterceptor)
 * @ApplyMasking('User')
 * async getUsers() {
 *   return this.usersService.findAll();
 * }
 * ```
 */
export const ApplyMasking = (subject: string): MethodDecorator => {
	return (
		target: object,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	) => {
		Reflect.defineMetadata(MASKING_SUBJECT_KEY, subject, descriptor.value);
		return descriptor;
	};
};

/**
 * 마스킹 Action 이름과 프리셋 매핑
 */
const MASKING_ACTION_PRESET_MAP: Record<string, string> = {
	"READ:MASKED:EMAIL": MASKING_PRESETS.EMAIL,
	"READ:MASKED:PHONE": MASKING_PRESETS.PHONE,
	"READ:MASKED:NAME": MASKING_PRESETS.NAME,
	"READ:MASKED:SSN": MASKING_PRESETS.SSN,
	"READ:MASKED:CARD": MASKING_PRESETS.CARD,
	"READ:MASKED:ACCOUNT": MASKING_PRESETS.ACCOUNT,
};

/**
 * 마스킹 Action에서 필드 타입 추출
 *
 * @param action - 마스킹 Action 이름 (예: 'READ:MASKED:EMAIL')
 * @returns 필드 타입 (예: 'EMAIL')
 */
function getMaskingFieldType(action: string): string | null {
	const match = action.match(/^READ:MASKED:(\w+)$/);
	return match?.[1] ?? null;
}

/**
 * 필드 타입을 일반적인 필드명으로 변환
 *
 * @param fieldType - 필드 타입 (예: 'EMAIL')
 * @returns 필드명 배열 (예: ['email'])
 */
function getFieldNamesForType(fieldType: string): string[] {
	const fieldTypeMap: Record<string, string[]> = {
		EMAIL: ["email"],
		PHONE: ["phone", "mobile", "telephone", "phoneNumber", "mobileNumber"],
		NAME: ["name", "fullName", "displayName", "userName"],
		SSN: ["ssn", "socialSecurityNumber", "residentNumber"],
		CARD: ["cardNumber", "creditCard", "debitCard"],
		ACCOUNT: ["accountNumber", "bankAccount"],
	};

	return fieldTypeMap[fieldType] ?? [];
}

/**
 * 마스킹 인터셉터
 *
 * @description
 * CASL 권한에 따라 API 응답의 민감한 필드를 마스킹합니다.
 * 사용자에게 특정 필드에 대한 마스킹 권한(READ:MASKED:xxx)이 있으면
 * 해당 필드의 값을 마스킹하여 응답합니다.
 *
 * @example
 * ```typescript
 * // Controller에서 사용
 * @Get()
 * @UseInterceptors(MaskingInterceptor)
 * @ApplyMasking('User')
 * async getUsers() {
 *   return this.usersService.findAll();
 * }
 *
 * // 마스킹 결과 예시
 * // 원본: { email: "test@example.com", name: "홍길동" }
 * // 마스킹: { email: "tes***@example.com", name: "홍*동" }
 * ```
 */
@Injectable()
export class MaskingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(MaskingInterceptor.name);

	constructor(
		private readonly reflector: Reflector,
		private readonly maskingService: MaskingService,
		private readonly caslAbilityFactory: CaslAbilityFactory,
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		// 인증되지 않은 요청은 그대로 반환
		if (!user) {
			this.logger.debug("인증되지 않은 요청 - 마스킹 건너뜀");
			return next.handle();
		}

		// 메타데이터에서 Subject 이름 가져오기
		const handler = context.getHandler();
		const subjectName = this.reflector.get<string>(
			MASKING_SUBJECT_KEY,
			handler,
		);

		// Subject가 지정되지 않았으면 마스킹 건너뜀
		if (!subjectName) {
			return next.handle();
		}

		// CASL Ability 생성
		let ability: AppAbility;
		try {
			ability = await this.caslAbilityFactory.createForUser(user);
		} catch (error) {
			this.logger.warn(
				`CASL Ability 생성 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
			);
			return next.handle();
		}

		// 마스킹 규칙 수집
		const maskingRules = this.collectMaskingRules(ability, subjectName);

		// 마스킹 규칙이 없으면 그대로 반환
		if (maskingRules.size === 0) {
			this.logger.debug(
				`마스킹 규칙 없음: userId=${user.id}, subject=${subjectName}`,
			);
			return next.handle();
		}

		this.logger.debug(
			`마스킹 규칙 적용: userId=${user.id}, subject=${subjectName}, fields=${Array.from(maskingRules.keys()).join(",")}`,
		);

		return next.handle().pipe(
			map((data) => this.applyMaskingToResponse(data, maskingRules)),
		);
	}

	/**
	 * 사용자의 마스킹 권한을 수집합니다.
	 *
	 * @param ability - CASL Ability 객체
	 * @param subjectName - Subject 이름
	 * @returns 필드명과 마스킹 설정의 Map
	 */
	private collectMaskingRules(
		ability: AppAbility,
		subjectName: string,
	): Map<string, ActionConfig> {
		const maskingRules = new Map<string, ActionConfig>();

		// 모든 마스킹 Action에 대해 권한 확인
		for (const [actionName, preset] of Object.entries(
			MASKING_ACTION_PRESET_MAP,
		)) {
			const action = actionName as Actions;

			// Subject에 대한 마스킹 권한이 있는지 확인
			// 'entity:User' 형식과 'User' 형식 모두 지원
			const hasPermissionWithPrefix = ability.can(
				action,
				`entity:${subjectName}`,
			);
			const hasPermissionWithoutPrefix = ability.can(action, subjectName);

			if (hasPermissionWithPrefix || hasPermissionWithoutPrefix) {
				const fieldType = getMaskingFieldType(actionName);
				if (fieldType) {
					const fieldNames = getFieldNamesForType(fieldType);
					const config: ActionConfig = {
						type: "masking" as const,
						preset,
					};

					// 해당 필드 타입의 모든 가능한 필드명에 대해 마스킹 규칙 추가
					for (const fieldName of fieldNames) {
						maskingRules.set(fieldName, config);
					}
				}
			}
		}

		return maskingRules;
	}

	/**
	 * 응답 데이터에 마스킹을 적용합니다.
	 *
	 * @param data - 응답 데이터
	 * @param maskingRules - 마스킹 규칙 Map
	 * @returns 마스킹이 적용된 데이터
	 */
	private applyMaskingToResponse(
		data: unknown,
		maskingRules: Map<string, ActionConfig>,
	): unknown {
		if (data == null) {
			return data;
		}

		// ResponseEntity 또는 wrapResponse로 래핑된 응답 처리
		if (isWrappedResponse(data)) {
			const wrappedData = data.data;
			const maskedData = this.maskData(wrappedData, maskingRules);
			return {
				...data,
				data: maskedData,
			};
		}

		// data 필드가 있는 객체 (ResponseEntity 형태)
		if (
			typeof data === "object" &&
			!Array.isArray(data) &&
			"data" in (data as Record<string, unknown>)
		) {
			const record = data as Record<string, unknown>;
			const maskedData = this.maskData(record.data, maskingRules);
			return {
				...record,
				data: maskedData,
			};
		}

		// 일반 데이터
		return this.maskData(data, maskingRules);
	}

	/**
	 * 데이터에 마스킹을 적용합니다.
	 *
	 * @param data - 마스킹할 데이터
	 * @param maskingRules - 마스킹 규칙 Map
	 * @returns 마스킹이 적용된 데이터
	 */
	private maskData(
		data: unknown,
		maskingRules: Map<string, ActionConfig>,
	): unknown {
		if (data == null) {
			return data;
		}

		// 배열인 경우 각 요소에 마스킹 적용
		if (Array.isArray(data)) {
			return this.maskingService.maskFieldsArray(
				data as object[],
				maskingRules,
			);
		}

		// 객체인 경우 필드에 마스킹 적용
		if (typeof data === "object") {
			return this.maskingService.maskFields(data as object, maskingRules);
		}

		// 기본형 데이터는 그대로 반환
		return data;
	}
}
