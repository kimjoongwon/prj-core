import {
	PreviewTemplateDto,
	QueryTemplateDto,
	SendTestTemplateDto,
} from "@cocrepo/dto";
import { Template } from "@cocrepo/entity";
import { TemplateType } from "@cocrepo/prisma";
import { TemplatesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import type {
	CreateTemplateInput,
	UpdateTemplateInput,
	TemplateVariableInput,
} from "./input/index";

/**
 * 변수 치환 결과
 */
interface SubstituteResult {
	/** 치환된 제목 */
	subject: string | null;
	/** 치환된 본문 */
	content: string;
	/** 미치환 변수 목록 */
	unresolvedVariables: string[];
}

/**
 * 테스트 발송 결과
 */
export interface SendTestResult {
	/** 발송 성공 여부 */
	success: boolean;
	/** 발송 시각 */
	sentAt: string;
	/** 오류 메시지 */
	errorMessage: string | null;
}

@Injectable()
export class TemplatesService {
	private readonly logger = new Logger(TemplatesService.name);

	constructor(private readonly repository: TemplatesRepository) {}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * 템플릿 목록 조회
	 */
	async getTemplates(
		query: QueryTemplateDto,
	): Promise<{ data: Template[]; totalCount: number }> {
		const where = query.toPrismaWhere();
		const orderBy = query.toPrismaOrderBy();

		return this.repository.findMany({
			where,
			orderBy,
			skip: query.skip,
			take: query.take,
		});
	}

	/**
	 * ID로 템플릿 조회 (variables 포함)
	 */
	async getTemplateById(id: string): Promise<Template> {
		const template = await this.repository.findById(id);
		if (!template) {
			throw new NotFoundException("템플릿을 찾을 수 없습니다");
		}
		return template;
	}

	// ============================================================================
	// 생성 / 수정 / 삭제
	// ============================================================================

	/**
	 * 템플릿 생성
	 * - 코드 중복 검사
	 * - 유형별 필드 검증
	 * - 변수가 있으면 함께 생성
	 */
	async create(input: CreateTemplateInput): Promise<Template> {
		this.logger.debug(`템플릿 생성 시도: code=${input.code}`);

		// 코드 중복 검사
		const existing = await this.repository.findByCode(input.code);
		if (existing) {
			throw new ConflictException(
				`이미 존재하는 템플릿 코드입니다: ${input.code}`,
			);
		}

		// 유형별 필드 검증
		this.validateTypeConstraints(input.type, input.subject, input.content);

		const templateData = {
			code: input.code,
			name: input.name,
			type: input.type,
			subject: input.subject ?? null,
			content: input.content,
			description: input.description ?? null,
		};

		// 변수가 있으면 함께 생성
		if (input.variables && input.variables.length > 0) {
			return this.repository.createWithVariables(
				templateData,
				input.variables.map((v) => ({
					name: v.name,
					description: v.description,
					defaultValue: v.defaultValue,
					isRequired: v.isRequired,
				})),
			);
		}

		return this.repository.create(templateData);
	}

	/**
	 * 템플릿 수정
	 * - 존재 확인
	 * - 유형별 필드 검증 (기존 type 사용)
	 * - 변수가 있으면 전체 교체
	 */
	async update(id: string, input: UpdateTemplateInput): Promise<Template> {
		this.logger.debug(`템플릿 수정 시도: ${id.slice(-8)}`);

		const template = await this.repository.findByIdOrThrow(id);

		// 유형별 필드 검증 (기존 template의 type 사용)
		this.validateTypeConstraints(
			template.type,
			input.subject !== undefined ? input.subject : template.subject,
			input.content !== undefined ? input.content : template.content,
		);

		const templateData: Record<string, unknown> = {};
		if (input.name !== undefined) templateData.name = input.name;
		if (input.subject !== undefined) templateData.subject = input.subject;
		if (input.content !== undefined) templateData.content = input.content;
		if (input.description !== undefined)
			templateData.description = input.description;

		// 변수가 있으면 전체 교체
		if (input.variables !== undefined) {
			return this.repository.updateWithVariables(
				id,
				templateData,
				(input.variables ?? []).map((v) => ({
					name: v.name,
					description: v.description,
					defaultValue: v.defaultValue,
					isRequired: v.isRequired,
				})),
			);
		}

		return this.repository.updateById(id, templateData);
	}

	/**
	 * 템플릿 소프트 삭제
	 */
	async remove(id: string): Promise<Template> {
		this.logger.debug(`템플릿 삭제 시도: ${id.slice(-8)}`);

		await this.repository.findByIdOrThrow(id);

		return this.repository.removeById(id);
	}

	// ============================================================================
	// 상태 토글
	// ============================================================================

	/**
	 * 템플릿 활성/비활성 상태 토글
	 */
	async toggleStatus(id: string): Promise<Template> {
		this.logger.debug(`템플릿 상태 토글: ${id.slice(-8)}`);

		const template = await this.repository.findByIdOrThrow(id);

		await this.repository.updateById(id, {
			isActive: !template.isActive,
		});

		// variables 포함 재조회
		return this.getTemplateById(id);
	}

	// ============================================================================
	// 미리보기 / 테스트 발송
	// ============================================================================

	/**
	 * 템플릿 미리보기
	 * - 변수 치환 후 결과 반환
	 * - 미치환 변수 목록 포함
	 */
	async preview(
		id: string,
		dto: PreviewTemplateDto,
	): Promise<{
		type: TemplateType;
		subject: string | null;
		content: string;
		unresolvedVariables: string[];
	}> {
		const template = await this.repository.findByIdOrThrow(id);

		const result = this.substituteVariables(template, dto.variables);

		return {
			type: template.type,
			subject: result.subject,
			content: result.content,
			unresolvedVariables: result.unresolvedVariables,
		};
	}

	/**
	 * 템플릿 테스트 발송
	 * - 비활성 템플릿 차단
	 * - 필수 변수 검증
	 * - 수신자 형식 검증
	 * - 실제 발송은 TODO (발송 서비스 미구현)
	 */
	async sendTest(
		id: string,
		dto: SendTestTemplateDto,
	): Promise<SendTestResult> {
		this.logger.debug(`템플릿 테스트 발송: ${id.slice(-8)}`);

		const template = await this.repository.findByIdOrThrow(id);

		// 비활성 템플릿 차단
		if (!template.isActive) {
			throw new BadRequestException(
				"비활성 템플릿은 테스트 발송할 수 없습니다",
			);
		}

		// 필수 변수 검증
		if (template.variables && template.variables.length > 0) {
			const missingVariables = template.variables
				.filter(
					(v) => v.isRequired && !dto.variables[v.name] && !v.defaultValue,
				)
				.map((v) => v.name);

			if (missingVariables.length > 0) {
				throw new BadRequestException(
					`필수 변수가 누락되었습니다: ${missingVariables.join(", ")}`,
				);
			}
		}

		// 수신자 형식 검증
		this.validateRecipient(template.type, dto.recipient);

		// 변수 치환
		const substituted = this.substituteVariables(template, dto.variables);

		// TODO: 실제 발송 서비스 연동 (현재는 로그만 남김)
		this.logger.warn(
			`[테스트 발송] type=${template.type}, recipient=${dto.recipient}, ` +
				`subject=${substituted.subject}, contentLength=${substituted.content.length}`,
		);

		return {
			success: true,
			sentAt: new Date().toISOString(),
			errorMessage: null,
		};
	}

	// ============================================================================
	// Private 메서드
	// ============================================================================

	/**
	 * 템플릿 유형별 필드 제약 검증
	 * - EMAIL/PUSH: subject 필수
	 * - PUSH: subject 50자 제한, content 200자 제한
	 */
	private validateTypeConstraints(
		type: TemplateType,
		subject: string | null | undefined,
		content: string | null | undefined,
	): void {
		// EMAIL, PUSH: subject 필수
		if (
			(type === TemplateType.EMAIL || type === TemplateType.PUSH) &&
			!subject
		) {
			throw new BadRequestException(
				`${type} 유형 템플릿은 제목(subject)이 필수입니다`,
			);
		}

		// PUSH: subject 50자 제한
		if (type === TemplateType.PUSH && subject && subject.length > 50) {
			throw new BadRequestException(
				"PUSH 템플릿의 제목은 50자를 초과할 수 없습니다",
			);
		}

		// PUSH: content 200자 제한
		if (type === TemplateType.PUSH && content && content.length > 200) {
			throw new BadRequestException(
				"PUSH 템플릿의 본문은 200자를 초과할 수 없습니다",
			);
		}
	}

	/**
	 * 수신자 형식 검증
	 * - EMAIL: 이메일 형식
	 * - SMS: 전화번호 형식
	 * - PUSH: 비어있지 않은지 검증
	 */
	private validateRecipient(type: TemplateType, recipient: string): void {
		if (!recipient || recipient.trim().length === 0) {
			throw new BadRequestException("수신자를 입력해주세요");
		}

		switch (type) {
			case TemplateType.EMAIL: {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(recipient)) {
					throw new BadRequestException("올바른 이메일 주소를 입력해주세요");
				}
				break;
			}
			case TemplateType.SMS: {
				const phoneRegex = /^(\+?\d{1,4}[-\s]?)?\d{8,15}$/;
				if (!phoneRegex.test(recipient.replace(/[-\s]/g, ""))) {
					throw new BadRequestException("올바른 전화번호를 입력해주세요");
				}
				break;
			}
			case TemplateType.PUSH: {
				// 디바이스 토큰은 비어있지 않으면 유효
				break;
			}
		}
	}

	/**
	 * 변수 치환
	 * 1. 입력된 변수로 {{key}} 치환
	 * 2. 기본값이 있는 미치환 변수를 기본값으로 치환
	 * 3. 미치환 변수 감지 ({{...}} 패턴 잔존)
	 */
	private substituteVariables(
		template: Template,
		variables: Record<string, string>,
	): SubstituteResult {
		let subject = template.subject;
		let content = template.content;

		// 1단계: 입력된 변수로 치환
		for (const [key, value] of Object.entries(variables)) {
			const placeholder = `{{${key}}}`;
			if (subject) {
				subject = subject.replaceAll(placeholder, value);
			}
			content = content.replaceAll(placeholder, value);
		}

		// 2단계: 기본값이 있는 미치환 변수를 기본값으로 치환
		if (template.variables && template.variables.length > 0) {
			for (const variable of template.variables) {
				if (variable.defaultValue) {
					const placeholder = `{{${variable.name}}}`;
					if (subject) {
						subject = subject.replaceAll(placeholder, variable.defaultValue);
					}
					content = content.replaceAll(placeholder, variable.defaultValue);
				}
			}
		}

		// 3단계: 미치환 변수 감지
		const unresolvedRegex = /\{\{(\w+)\}\}/g;
		const unresolvedSet = new Set<string>();
		let match: RegExpExecArray | null;

		if (subject) {
			match = unresolvedRegex.exec(subject);
			while (match !== null) {
				unresolvedSet.add(match[1]);
				match = unresolvedRegex.exec(subject);
			}
		}

		// content에서도 미치환 변수 검색 (regex lastIndex 초기화)
		unresolvedRegex.lastIndex = 0;
		match = unresolvedRegex.exec(content);
		while (match !== null) {
			unresolvedSet.add(match[1]);
			match = unresolvedRegex.exec(content);
		}

		return {
			subject,
			content,
			unresolvedVariables: [...unresolvedSet],
		};
	}
}
