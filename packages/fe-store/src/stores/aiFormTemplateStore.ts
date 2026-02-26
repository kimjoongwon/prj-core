import { createLogger } from "@cocrepo/toolkit";
import type {
	AIFormExecuteResponse,
	AIFormPreviewResponse,
	AIFormTemplate,
} from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

const logger = createLogger("[AIFormTemplateStore]");

/**
 * AIFormTemplateStore - AI 폼 템플릿 비즈니스 로직
 *
 * AI 폼 템플릿의 상태를 관리하고 CRUD 작업 및 AI 실행 기능을 제공합니다.
 * API 호출은 외부(React Query)에서 수행 후 결과를 전달받습니다.
 *
 * @example
 * ```typescript
 * const rootStore = new RootStore();
 * rootStore.aiFormTemplateStore = new AIFormTemplateStore(rootStore);
 *
 * // 템플릿 목록 설정 (외부에서 API 호출 후)
 * aiFormTemplateStore.setTemplates(templates);
 *
 * // AI 실행
 * const result = await aiFormTemplateStore.executeAI(templateId, context, prompt);
 * ```
 */
export class AIFormTemplateStore {
	readonly rootStore: RootStore;

	/** 템플릿 목록 */
	templates: AIFormTemplate[] = [];

	/** 현재 선택된 템플릿 */
	currentTemplate: AIFormTemplate | null = null;

	/** 로딩 상태 */
	isLoading = false;

	/** 에러 메시지 */
	error: string | null = null;

	/** AI 실행 결과 */
	executeResult: AIFormExecuteResponse | null = null;

	/** AI 미리보기 결과 */
	previewResult: AIFormPreviewResponse | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	// === Computed ===

	/**
	 * 활성화된 템플릿만 필터링
	 */
	get activeTemplates(): AIFormTemplate[] {
		return this.templates.filter((t) => t.status === "ACTIVE");
	}

	/**
	 * 도메인별 그룹화된 템플릿
	 */
	get templatesByDomain(): Record<string, AIFormTemplate[]> {
		return this.templates.reduce(
			(acc, template) => {
				const domain = template.targetDomain;
				if (!acc[domain]) {
					acc[domain] = [];
				}
				acc[domain].push(template);
				return acc;
			},
			{} as Record<string, AIFormTemplate[]>,
		);
	}

	/**
	 * 현재 템플릿의 필드 목록 (정렬됨)
	 */
	get currentFields() {
		if (!this.currentTemplate?.fields) return [];
		return [...this.currentTemplate.fields].sort((a, b) => a.order - b.order);
	}

	/**
	 * 실행 결과가 있는지 확인
	 */
	get hasExecuteResult(): boolean {
		return this.executeResult !== null;
	}

	/**
	 * 미리보기 결과가 있는지 확인
	 */
	get hasPreviewResult(): boolean {
		return this.previewResult !== null;
	}

	// === Actions ===

	/**
	 * 로딩 상태 설정
	 */
	setLoading(loading: boolean): void {
		this.isLoading = loading;
	}

	/**
	 * 에러 설정
	 */
	setError(error: string | null): void {
		this.error = error;
		if (error) {
			logger.error("에러 발생:", error);
		}
	}

	/**
	 * 템플릿 목록 설정 (외부에서 API 호출 후)
	 */
	setTemplates(templates: AIFormTemplate[]): void {
		this.templates = templates;
		this.error = null;
	}

	/**
	 * 템플릿 목록에 추가
	 */
	addTemplate(template: AIFormTemplate): void {
		this.templates.push(template);
	}

	/**
	 * 템플릿 업데이트
	 */
	updateTemplateInList(id: string, data: Partial<AIFormTemplate>): void {
		const index = this.templates.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.templates[index] = { ...this.templates[index], ...data };
		}
		// 현재 템플릿도 업데이트
		if (this.currentTemplate?.id === id) {
			this.currentTemplate = { ...this.currentTemplate, ...data };
		}
	}

	/**
	 * 템플릿 삭제
	 */
	removeTemplate(id: string): void {
		this.templates = this.templates.filter((t) => t.id !== id);
		if (this.currentTemplate?.id === id) {
			this.currentTemplate = null;
		}
	}

	/**
	 * 현재 템플릿 설정
	 */
	setCurrentTemplate(template: AIFormTemplate | null): void {
		this.currentTemplate = template;
		this.error = null;
	}

	/**
	 * ID로 현재 템플릿 선택
	 */
	selectTemplateById(id: string): void {
		const template = this.templates.find((t) => t.id === id);
		this.setCurrentTemplate(template ?? null);
	}

	/**
	 * AI 실행 결과 설정
	 */
	setExecuteResult(result: AIFormExecuteResponse | null): void {
		this.executeResult = result;
	}

	/**
	 * AI 미리보기 결과 설정
	 */
	setPreviewResult(result: AIFormPreviewResponse | null): void {
		this.previewResult = result;
	}

	/**
	 * 실행 결과 초기화
	 */
	clearResult(): void {
		this.executeResult = null;
		this.previewResult = null;
		this.error = null;
	}

	/**
	 * 모든 상태 초기화
	 */
	clear(): void {
		this.templates = [];
		this.currentTemplate = null;
		this.isLoading = false;
		this.error = null;
		this.executeResult = null;
		this.previewResult = null;
	}

	/**
	 * 도메인별 템플릿 필터링
	 */
	getTemplatesByDomain(domain: string): AIFormTemplate[] {
		return this.templates.filter((t) => t.targetDomain === domain);
	}

	/**
	 * 엔티티별 템플릿 필터링
	 */
	getTemplatesByEntity(entity: string): AIFormTemplate[] {
		return this.templates.filter((t) => t.targetEntity === entity);
	}
}
