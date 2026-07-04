"use client";

import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { DATA_GRID_SKELETON_ROWS } from "../internal/constants";

export function DataGridLoadingView() {
	return (
		<div className="space-y-3">
			<div className="flex gap-4 p-4 bg-surface-secondary rounded-lg">
				<Skeleton className="w-8 h-4 rounded" />
				<Skeleton className="w-32 h-4 rounded" />
				<Skeleton className="w-48 h-4 rounded" />
				<Skeleton className="w-24 h-4 rounded" />
				<Skeleton className="w-20 h-4 rounded" />
			</div>
			{DATA_GRID_SKELETON_ROWS.map((index) => (
				<div key={index} className="flex gap-4 p-4 bg-surface rounded-lg">
					<Skeleton className="w-8 h-4 rounded" />
					<Skeleton className="w-32 h-4 rounded" />
					<Skeleton className="w-48 h-4 rounded" />
					<Skeleton className="w-24 h-4 rounded" />
					<Skeleton className="w-20 h-4 rounded" />
				</div>
			))}
		</div>
	);
}
