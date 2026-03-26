"use client";

import { Skeleton } from "@heroui/react";
import { observer } from "mobx-react-lite";

/**
 * MetaDataGrid 로딩 스켈레톤
 */
export const MetaDataGridSkeleton = observer(function MetaDataGridSkeleton() {
	return (
		<div className="space-y-3">
			{/* 테이블 헤더 스켈레톤 */}
			<div className="flex gap-4 p-4 bg-content2 rounded-lg">
				<Skeleton className="w-8 h-4 rounded" />
				<Skeleton className="w-32 h-4 rounded" />
				<Skeleton className="w-48 h-4 rounded" />
				<Skeleton className="w-24 h-4 rounded" />
				<Skeleton className="w-20 h-4 rounded" />
			</div>

			{/* 테이블 행 스켈레톤 */}
			{Array.from({ length: 5 }).map((_, index) => (
				<div key={index} className="flex gap-4 p-4 bg-content1 rounded-lg">
					<Skeleton className="w-8 h-4 rounded" />
					<Skeleton className="w-32 h-4 rounded" />
					<Skeleton className="w-48 h-4 rounded" />
					<Skeleton className="w-24 h-4 rounded" />
					<Skeleton className="w-20 h-4 rounded" />
				</div>
			))}
		</div>
	);
});
