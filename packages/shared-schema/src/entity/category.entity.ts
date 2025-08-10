import { $Enums, Category as CategoryEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { CategoryDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Tenant } from "./tenant.entity";

@UseDto(CategoryDto)
export class Category
	extends AbstractEntity<CategoryDto>
	implements CategoryEntity
{
	name: string;
	type: $Enums.CategoryTypes;
	parentId: string | null;
	tenantId: string;

	parent?: Category;
	children?: Category[];
	tenant?: Tenant;

	/**
	 * Extract all parent category names from current category up to root
	 * @returns Array of category names from current to root
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
	 * Extract all children category names recursively
	 * @returns Array of all descendant category names
	 */
	getAllChildrenNames(): string[] {
		const childrenNames: string[] = [];

		const collectChildrenNames = (category: Category) => {
			if (category.children && category.children.length > 0) {
				for (const child of category.children) {
					if (child.name) {
						childrenNames.push(child.name);
					}
					// Recursively collect names from grandchildren
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
