import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Category extends AbstractEntity {
	/** 공개 식별자 ULID */
	categoryId!: string;

	name!: string;
	spaceId!: bigint;
	parentId!: bigint | null;
	createdById!: bigint | null;

	parent?: Category;
	children?: Category[];
	space?: Space;
	createdBy?: User;

	/**
	 * 현재 카테고리부터 루트까지 모든 상위 카테고리 이름을 추출합니다
	 * @returns 현재부터 루트까지의 카테고리 이름 배열
	 */
	getAllParentNames(): string[] {
		const categoryNames: string[] = [];
		let currentCategory: Category | undefined = this;

		while (currentCategory) {
			if (currentCategory.name) {
				categoryNames.push(currentCategory.name);
			}
			currentCategory = currentCategory.parent;
		}

		return categoryNames;
	}

	/**
	 * 모든 하위 카테고리 이름을 재귀적으로 추출합니다
	 * @returns 모든 하위 카테고리 이름 배열
	 */
	getAllChildrenNames(): string[] {
		const childrenNames: string[] = [];

		const collectChildrenNames = (category: Category) => {
			if (category.children && category.children.length > 0) {
				for (const child of category.children) {
					if (child.name) {
						childrenNames.push(child.name);
					}
					collectChildrenNames(child);
				}
			}
		};

		collectChildrenNames(this);
		return childrenNames;
	}

	toOption() {
		return {
			key: this.id,
			value: this.id,
			text: this.name,
		};
	}
}
