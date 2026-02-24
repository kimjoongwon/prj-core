import { makeAutoObservable } from "mobx";

/**
 * ProgramStore - 프로그램 관련 UI 상태
 *
 * 프로그램(Program) 관련 페이지의 클라이언트 상태를 관리합니다.
 * Program은 Session 상세 페이지 내에 임베딩되어 관리되므로,
 * 이 Store는 세션 상세 페이지의 "프로그램 목록" 섹션 상태와 Program 폼 상태를 담당합니다.
 * 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당합니다.
 *
 * @example
 * ```typescript
 * const programStore = new ProgramStore();
 *
 * // 프로그램 목록 페이지네이션
 * programStore.setProgramPage(2);
 *
 * // 폼 작성
 * programStore.setFormRoutineId("routine-1");
 * programStore.setFormInstructorId("user-1");
 * programStore.setFormName("요가 클래스");
 * programStore.setFormCapacity(20);
 * programStore.setFormLevel("중급");
 *
 * // 폼 제출 전 검증
 * if (programStore.isFormValid) {
 *   await createProgram(programStore.formData);
 *   programStore.resetForm();
 * }
 * ```
 */
export class ProgramStore {
	// ============================================================================
	// Observable State - 프로그램 목록 (세션 상세 내)
	// ============================================================================

	/** 프로그램 목록 현재 페이지 */
	programPage = 1;

	/** 프로그램 목록 페이지당 항목 수 */
	programTake = 10;

	// ============================================================================
	// Observable State - 프로그램 폼
	// ============================================================================

	/** 선택된 루틴 ID */
	formRoutineId = "";

	/** 선택된 강사 User ID */
	formInstructorId = "";

	/** 프로그램 이름 */
	formName = "";

	/** 프로그램 정원 */
	formCapacity = 0;

	/** 난이도 (초급/중급/고급/null) */
	formLevel: string | null = null;

	// ============================================================================
	// Constructor
	// ============================================================================

	constructor() {
		makeAutoObservable(this);
	}

	// ============================================================================
	// Computed
	// ============================================================================

	/** 프로그램 목록 offset */
	get programSkip(): number {
		return (this.programPage - 1) * this.programTake;
	}

	/** useGetPrograms 훅에 전달할 파라미터 */
	get programListParams(): { take: number; skip: number } {
		return {
			take: this.programTake,
			skip: this.programSkip,
		};
	}

	/** 폼 유효성 검증 */
	get isFormValid(): boolean {
		return (
			this.formName.length > 0 &&
			this.formRoutineId.length > 0 &&
			this.formInstructorId.length > 0 &&
			this.formCapacity >= 1
		);
	}

	// ============================================================================
	// Actions - 프로그램 목록
	// ============================================================================

	/**
	 * 프로그램 목록 페이지 변경
	 */
	setProgramPage(page: number): void {
		this.programPage = page;
	}

	// ============================================================================
	// Actions - 프로그램 폼
	// ============================================================================

	/**
	 * 루틴 선택
	 */
	setFormRoutineId(routineId: string): void {
		this.formRoutineId = routineId;
	}

	/**
	 * 강사 선택
	 */
	setFormInstructorId(instructorId: string): void {
		this.formInstructorId = instructorId;
	}

	/**
	 * 프로그램 이름 입력
	 */
	setFormName(name: string): void {
		this.formName = name;
	}

	/**
	 * 정원 설정
	 */
	setFormCapacity(capacity: number): void {
		this.formCapacity = capacity;
	}

	/**
	 * 난이도 설정
	 */
	setFormLevel(level: string | null): void {
		this.formLevel = level;
	}

	/**
	 * 폼 상태 초기화 (등록/수정 완료 후)
	 */
	resetForm(): void {
		this.formRoutineId = "";
		this.formInstructorId = "";
		this.formName = "";
		this.formCapacity = 0;
		this.formLevel = null;
	}

	// ============================================================================
	// Actions - Reset
	// ============================================================================

	/**
	 * 모든 상태 초기화
	 */
	reset(): void {
		this.programPage = 1;
		this.resetForm();
	}
}
