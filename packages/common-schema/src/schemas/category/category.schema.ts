import { String } from "../../decorators";

/** Category 모델의 공용 입력 검증 규칙입니다. */
export class CategorySchema {
	/** Category 이름 입력값입니다. */
	@String()
	name: string;

	/** 상위 Category id입니다. 값이 없으면 최상위 Category입니다. */
	@String({ required: false })
	parentId?: string | null;
}
