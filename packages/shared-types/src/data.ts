// Table and data grid related interfaces
export interface PaginationState {
	skip: number;
	take: number;
}

export interface QuerySorting {
	query: {
		sortingKey?: string;
		sortingValue?: "asc" | "desc";
		skip: number;
		take: number;
	};
}

export interface SearchFilterState<T extends object> {
	filter?: {
		[key in keyof T]?: string;
	};
}

// Category related interfaces
export interface CategoryCardProps {
	category: any; // CategoryDto type would be imported from model
	selected?: boolean;
	onClickEdit?: (category: any) => void;
	onClickDelete?: (category: any) => void;
	onClickCard?: (category: any) => void;
	onClickDetail?: (category: any) => void;
	onClickCreate?: (category: any) => void;
}