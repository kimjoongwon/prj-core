"use client";

import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Pagination as BasePagination,
	type PaginationProps as BasePaginationProps,
} from "./Pagination";

export interface PaginationProps<T>
	extends MobxProps<T>,
		Omit<BasePaginationProps, "page" | "onChange"> {
	/** URL 쿼리 파라미터 이름 (기본값: "page") */
	queryParam?: string;
	/** URL 쿼리 업데이트 비활성화 */
	disableUrlSync?: boolean;
}

/**
 * Pagination Stateful 컴포넌트
 *
 * MobX state와 연동하여 페이지 값을 관리하고,
 * URL 쿼리 파라미터를 자동으로 업데이트합니다.
 */
export const Pagination = observer(
	<T extends object>(props: PaginationProps<T>) => {
		const {
			state,
			path,
			totalCount,
			limit,
			queryParam = "page",
			disableUrlSync = false,
			...rest
		} = props;

		const router = useRouter();
		const searchParams = useSearchParams();

		// state에서 현재 페이지 값 읽기
		const currentPage = (tools.get(state, path) as number) || 1;

		const handleChange = (newPage: number) => {
			// MobX state 업데이트
			runInAction(() => {
				tools.set(state, path, newPage);
			});

			// URL 쿼리 업데이트 (옵션)
			if (!disableUrlSync) {
				const params = new URLSearchParams(searchParams.toString());
				params.set(queryParam, String(newPage));
				router.replace(`?${params.toString()}`);
			}
		};

		return (
			<BasePagination
				{...rest}
				totalCount={totalCount}
				limit={limit}
				page={currentPage}
				onChange={handleChange}
			/>
		);
	},
);

// Pure 버전 타입 재export
export type { BasePaginationProps as PurePaginationProps };
