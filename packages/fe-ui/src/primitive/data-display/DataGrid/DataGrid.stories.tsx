import type { Meta, StoryObj } from "@storybook/react";
import { createColumnHelper } from "@tanstack/react-table";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Pagination } from "../../../input/Pagination/Pagination";
import type {
	MultiSortDescriptor,
	SortEvent,
} from "../Table/SortableColumnHeader";
import { DataGrid, type DataGridProps, type Key } from "./DataGrid";

interface SampleData {
	id: Key;
	name: string;
	age: number;
	city: string;
	email: string;
	status: "활성" | "비활성";
}

// 50개의 샘플 데이터 생성
const generateSampleData = (count: number): SampleData[] => {
	const cities = ["서울", "부산", "대구", "인천", "광주", "대전", "울산"];
	const statuses: ("활성" | "비활성")[] = ["활성", "비활성"];
	const names = [
		"김철수",
		"이영희",
		"박민수",
		"최지영",
		"정현우",
		"한소희",
		"강동원",
		"송혜교",
	];

	return Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		name: `${names[i % names.length]}${Math.floor(i / names.length) + 1}`,
		age: 20 + (i % 30),
		city: cities[i % cities.length],
		email: `user${i + 1}@example.com`,
		status: statuses[i % 2],
	}));
};

const allSampleData = generateSampleData(53);
const sampleData = allSampleData.slice(0, 5);

const columnHelper = createColumnHelper<SampleData>();

const columns = [
	columnHelper.accessor("id", {
		header: "ID",
	}),
	columnHelper.accessor("name", {
		header: "이름",
	}),
	columnHelper.accessor("age", {
		header: "나이",
	}),
	columnHelper.accessor("city", {
		header: "도시",
	}),
	columnHelper.accessor("email", {
		header: "이메일",
	}),
	columnHelper.accessor("status", {
		header: "상태",
		cell: ({ getValue }) => {
			const status = getValue();
			return (
				<span
					className={status === "활성" ? "text-success-500" : "text-danger-500"}
				>
					{status}
				</span>
			);
		},
	}),
];

const meta = {
	title: "Ui/data-display/DataGrid",
	component: DataGrid,
	args: {
		"aria-label": "샘플 데이터 그리드",
	},
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"React Table과 HeroUI를 기반으로 한 데이터 그리드 컴포넌트입니다. 선택, 확장, 복합 정렬, 페이지네이션, 로딩 기능을 제공합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		data: {
			description: "표시할 데이터 배열",
		},
		columns: {
			description: "테이블 컬럼 정의",
		},
		selectionMode: {
			control: "select",
			options: ["none", "single", "multiple"],
			description: "선택 모드",
			defaultValue: "none",
		},
		state: {
			description: "DataGrid 상태 관리 객체",
		},
		sortableColumns: {
			description: "정렬 가능한 컬럼 ID 목록",
		},
		onSortChange: {
			description: "정렬 변경 핸들러 (SortEvent) => void",
		},
		isLoading: {
			description: "로딩 상태",
		},
	},
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type StoryDataGridProps = Partial<DataGridProps<SampleData>>;

const DataGridWrapper = observer<StoryDataGridProps>(
	({ data = sampleData, columns: storyColumns = columns, ...rest }) => {
		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
		}));

		return (
			<DataGrid data={data} columns={storyColumns} state={state} {...rest} />
		);
	},
);

/**
 * 복합 정렬 로직 헬퍼 함수
 */
const handleSortChange = (
	event: SortEvent,
	sorting: MultiSortDescriptor,
	maxSortColumns = 3,
): MultiSortDescriptor => {
	const { column, shiftKey, ctrlKey } = event;
	const existingIndex = sorting.findIndex((s) => s.column === column);
	const exists = existingIndex !== -1;

	// Ctrl+클릭: 해당 컬럼 정렬 제거
	if (ctrlKey) {
		if (exists) {
			return sorting.filter((_, i) => i !== existingIndex);
		}
		return sorting;
	}

	// Shift+클릭: 복합 정렬
	if (shiftKey) {
		if (exists) {
			const currentDirection = sorting[existingIndex].direction;
			if (currentDirection === "asc") {
				// asc -> desc
				const newSorting = [...sorting];
				newSorting[existingIndex] = { column, direction: "desc" };
				return newSorting;
			}
			// desc -> 제거
			return sorting.filter((_, i) => i !== existingIndex);
		}
		// 새 컬럼 추가 (최대 개수 제한)
		if (sorting.length < maxSortColumns) {
			return [...sorting, { column, direction: "asc" as const }];
		}
		return sorting;
	}

	// 일반 클릭: 단일 정렬 (3단계 순환)
	if (exists && sorting.length === 1) {
		const currentDirection = sorting[0].direction;
		if (currentDirection === "asc") {
			// asc -> desc
			return [{ column, direction: "desc" }];
		}
		// desc -> 없음
		return [];
	}
	// 새 컬럼 또는 복합 정렬에서 단일 정렬로 전환
	return [{ column, direction: "asc" as const }];
};

// 복합 정렬 기능이 포함된 래퍼
const MultiSortDataGridWrapper = observer<StoryDataGridProps>(
	({
		data = sampleData,
		columns: storyColumns = columns,
		sortableColumns = ["id", "name", "age", "city", "email"],
		selectionMode = "none",
		...rest
	}) => {
		const [sorting, setSorting] = useState<MultiSortDescriptor>([]);

		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
		}));

		const onSortChange = (event: SortEvent) => {
			setSorting((prev) => handleSortChange(event, prev));
		};

		// 서버 복합 정렬 시뮬레이션
		const sortedData = [...data].sort((a, b) => {
			for (const sort of sorting) {
				const col = sort.column as keyof SampleData;
				const aVal = a[col];
				const bVal = b[col];

				let comparison = 0;
				if (typeof aVal === "string" && typeof bVal === "string") {
					comparison = aVal.localeCompare(bVal);
				} else if (typeof aVal === "number" && typeof bVal === "number") {
					comparison = aVal - bVal;
				}

				if (comparison !== 0) {
					return sort.direction === "asc" ? comparison : -comparison;
				}
			}
			return 0;
		});

		const formatSorting = (sorts: MultiSortDescriptor) => {
			if (sorts.length === 0) return "없음";
			return sorts
				.map((s, i) => `${i + 1}. ${s.column} (${s.direction})`)
				.join(" → ");
		};

		return (
			<div className="space-y-4">
				<div className="p-4 bg-default-100 rounded-lg space-y-2">
					<div className="text-sm font-medium">복합 정렬 상태:</div>
					<div className="text-sm text-default-500">
						{formatSorting(sorting)}
					</div>
					<div className="text-xs text-default-400 space-y-1">
						<div>• 클릭: 단일 정렬 (asc → desc → 해제)</div>
						<div>• Shift+클릭: 복합 정렬 추가 (최대 3개)</div>
						<div>• Ctrl+클릭 (Mac: Cmd+클릭): 해당 컬럼 정렬 제거</div>
					</div>
				</div>
				<DataGrid
					data={sortedData}
					columns={storyColumns}
					state={{ ...state, sorting }}
					onSortChange={onSortChange}
					sortableColumns={sortableColumns}
					selectionMode={selectionMode}
					{...rest}
				/>
			</div>
		);
	},
);

// 단일 정렬 기능이 포함된 래퍼 (기존 호환)
const SortableDataGridWrapper = observer<StoryDataGridProps>(
	({
		data = sampleData,
		columns: storyColumns = columns,
		sortableColumns = ["id", "name", "age", "email"],
		selectionMode = "none",
		...rest
	}) => {
		const [sorting, setSorting] = useState<MultiSortDescriptor>([]);

		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
		}));

		const onSortChange = (event: SortEvent) => {
			setSorting((prev) => handleSortChange(event, prev));
		};

		// 서버 정렬 시뮬레이션
		const sortedData = [...data].sort((a, b) => {
			if (sorting.length === 0) return 0;
			const { column, direction } = sorting[0];
			const col = column as keyof SampleData;
			const aVal = a[col];
			const bVal = b[col];

			if (typeof aVal === "string" && typeof bVal === "string") {
				return direction === "asc"
					? aVal.localeCompare(bVal)
					: bVal.localeCompare(aVal);
			}
			if (typeof aVal === "number" && typeof bVal === "number") {
				return direction === "asc" ? aVal - bVal : bVal - aVal;
			}
			return 0;
		});

		return (
			<div className="space-y-4">
				<div className="text-sm text-default-500">
					현재 정렬:{" "}
					{sorting.length > 0
						? `${sorting[0].column} (${sorting[0].direction})`
						: "없음"}
				</div>
				<DataGrid
					data={sortedData}
					columns={storyColumns}
					state={{ ...state, sorting }}
					onSortChange={onSortChange}
					sortableColumns={sortableColumns}
					selectionMode={selectionMode}
					{...rest}
				/>
			</div>
		);
	},
);

// 로딩 상태 데모
const LoadingDataGridWrapper = observer<StoryDataGridProps>(
	({
		data = sampleData,
		columns: storyColumns = columns,
		isLoading: initialLoading = true,
		selectionMode = "none",
		...rest
	}) => {
		const [isLoading, setIsLoading] = useState(initialLoading);

		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
		}));

		useEffect(() => {
			const timer = setTimeout(() => setIsLoading(false), 2000);
			return () => clearTimeout(timer);
		}, []);

		return (
			<div className="space-y-4">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setIsLoading(true)}
						className="px-3 py-1 bg-primary text-white rounded text-sm"
					>
						로딩 시작
					</button>
					<button
						type="button"
						onClick={() => setIsLoading(false)}
						className="px-3 py-1 bg-default-200 rounded text-sm"
					>
						로딩 종료
					</button>
				</div>
				<DataGrid
					data={data}
					columns={storyColumns}
					state={state}
					selectionMode={selectionMode}
					isLoading={isLoading}
					{...rest}
				/>
			</div>
		);
	},
);

// 서버 페이지네이션 데모
const PaginatedDataGridWrapper = observer<StoryDataGridProps>(
	({
		columns: storyColumns = columns,
		sortableColumns = ["id", "name", "age", "city", "email"],
		selectionMode = "multiple",
		...rest
	}) => {
		const [sorting, setSorting] = useState<MultiSortDescriptor>([]);
		const [isLoading, setIsLoading] = useState(false);
		const [page, setPage] = useState(1);
		const [pageSize] = useState(10);

		const state = useLocalObservable(() => ({
			selectedKeys: [] as Key[],
		}));

		const onSortChange = (event: SortEvent) => {
			setIsLoading(true);
			setSorting((prev) => handleSortChange(event, prev));
			setTimeout(() => setIsLoading(false), 500);
		};

		const onPageChange = (newPage: number) => {
			setIsLoading(true);
			setPage(newPage);
			setTimeout(() => setIsLoading(false), 500);
		};

		// 서버 복합 정렬 시뮬레이션
		const processedData = [...allSampleData];
		if (sorting.length > 0) {
			processedData.sort((a, b) => {
				for (const sort of sorting) {
					const col = sort.column as keyof SampleData;
					const aVal = a[col];
					const bVal = b[col];

					let comparison = 0;
					if (typeof aVal === "string" && typeof bVal === "string") {
						comparison = aVal.localeCompare(bVal);
					} else if (typeof aVal === "number" && typeof bVal === "number") {
						comparison = aVal - bVal;
					}

					if (comparison !== 0) {
						return sort.direction === "asc" ? comparison : -comparison;
					}
				}
				return 0;
			});
		}

		// 서버 페이지네이션 시뮬레이션
		const skip = (page - 1) * pageSize;
		const paginatedData = processedData.slice(skip, skip + pageSize);
		const totalCount = allSampleData.length;

		const formatSorting = (sorts: MultiSortDescriptor) => {
			if (sorts.length === 0) return "";
			return ` | 정렬: ${sorts.map((s) => `${s.column}(${s.direction})`).join(", ")}`;
		};

		return (
			<div className="space-y-4">
				<div className="text-sm text-default-500">
					총 {totalCount}개 항목 | 페이지 {page} /{" "}
					{Math.ceil(totalCount / pageSize)}
					{formatSorting(sorting)}
				</div>
				<DataGrid
					data={paginatedData}
					columns={storyColumns}
					state={{ ...state, sorting }}
					onSortChange={onSortChange}
					sortableColumns={sortableColumns}
					selectionMode={selectionMode}
					isLoading={isLoading}
					{...rest}
				/>
				<div className="flex justify-center">
					<Pagination
						totalCount={totalCount}
						page={page}
						onChange={onPageChange}
						showControls
					/>
				</div>
			</div>
		);
	},
);

export const 기본: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		emptyContent: "데이터가 없습니다.",
		selectionMode: "none",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "기본적인 데이터 그리드입니다.",
			},
		},
	},
};

export const 단일선택: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		selectionMode: "single",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "한 번에 하나의 행만 선택할 수 있는 데이터 그리드입니다.",
			},
		},
	},
};

export const 다중선택: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		selectionMode: "multiple",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "여러 행을 선택할 수 있는 데이터 그리드입니다.",
			},
		},
	},
};

export const 단일정렬: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		sortableColumns: ["id", "name", "age", "email"],
	},
	render: (args) => <SortableDataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"컬럼 헤더를 클릭하여 정렬할 수 있는 데이터 그리드입니다. 클릭 시 asc → desc → 해제 순으로 순환합니다.",
			},
		},
	},
};

export const 복합정렬: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		sortableColumns: ["id", "name", "age", "city", "email"],
	},
	render: (args) => <MultiSortDataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"복합 정렬을 지원하는 데이터 그리드입니다. Shift+클릭으로 여러 컬럼을 동시에 정렬할 수 있고, Ctrl+클릭으로 특정 정렬을 제거할 수 있습니다.",
			},
		},
	},
};

export const 로딩상태: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		isLoading: true,
	},
	render: (args) => <LoadingDataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"데이터 로딩 중 오버레이를 표시하는 데이터 그리드입니다. 버튼으로 로딩 상태를 토글할 수 있습니다.",
			},
		},
	},
};

export const 서버페이지네이션: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		sortableColumns: ["id", "name", "age", "city", "email"],
	},
	render: (args) => <PaginatedDataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"서버 페이지네이션과 복합 정렬을 시뮬레이션하는 데이터 그리드입니다. Shift+클릭으로 복합 정렬이 가능합니다. 총 53개의 데이터가 있습니다.",
			},
		},
	},
};

export const 빈데이터: Story = {
	args: {
		data: [],
		// @ts-expect-error
		columns: columns,
		emptyContent: "표시할 데이터가 없습니다.",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "데이터가 없을 때의 데이터 그리드입니다.",
			},
		},
	},
};

export const 커스텀빈내용: Story = {
	args: {
		data: [],
		// @ts-expect-error
		columns: columns,
		emptyContent: "검색 결과가 없습니다.",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story: "커스텀 빈 콘텐츠 메시지를 사용한 데이터 그리드입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		data: sampleData,
		// @ts-expect-error
		columns: columns,
		selectionMode: "multiple",
		emptyContent: "데이터가 없습니다.",
	},
	render: (args) => <DataGridWrapper {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"다양한 데이터 그리드 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
