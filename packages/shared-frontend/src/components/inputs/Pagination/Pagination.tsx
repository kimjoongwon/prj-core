import {
	Pagination as HeroUiPagination,
	PaginationProps as HeroUiPaginationProps,
} from "@heroui/react";
import { parseAsInteger, useQueryStates } from "nuqs";

export interface PaginationProps extends Omit<HeroUiPaginationProps, "total"> {
	totalCount: number;
}

export const Pagination = (props: PaginationProps) => {
	const { totalCount = 1, ...rest } = props;

	const [{ take, skip }, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(10),
		skip: parseAsInteger.withDefault(0),
	});

	const onChangePage = async (page: number) => {
		const skip = (page - 1) * take;
		setQueryStates(
			{
				skip,
				take: 10,
			},
			{
				history: "push",
				clearOnDefault: false,
				throttleMs: 500,
			},
		);
	};

	const total = Math.ceil(totalCount / take);

	const currentPage = Math.floor(skip / take) + 1;

	return (
		<HeroUiPagination
			{...rest}
			total={total}
			onChange={onChangePage}
			page={currentPage}
		/>
	);
};
