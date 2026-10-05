"use client";

import { observer } from "mobx-react-lite";
import type { PaginationProps } from "./Pagination";
import {
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationNextIcon,
	PaginationPrevious,
	PaginationPreviousIcon,
	PaginationRoot,
	PaginationSummary,
	Pagination as PurePagination,
	paginationVariants,
} from "./Pagination";

export type {
	PaginationContentProps,
	PaginationEllipsisProps,
	PaginationItemProps,
	PaginationLinkProps,
	PaginationNextIconProps,
	PaginationNextProps,
	PaginationPreviousIconProps,
	PaginationPreviousProps,
	PaginationProps,
	PaginationRootProps,
	PaginationSummaryProps,
	PaginationVariants,
} from "./Pagination";

const Pagination = observer((props: PaginationProps) => {
	return <PurePagination {...props} />;
});

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationNextIcon,
	PaginationPrevious,
	PaginationPreviousIcon,
	PaginationRoot,
	PaginationSummary,
	paginationVariants,
};
