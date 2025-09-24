// SVG 폴더 아이콘 컴포넌트들
const FolderOpenIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>폴더 열림 아이콘</title>
		<path
			fillRule="evenodd"
			d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5H21V18a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 18v-7.5h9.75z"
			clipRule="evenodd"
		/>
	</svg>
);
const FolderClosedIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>폴더 닫힘 아이콘</title>
		<path d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15z" />
	</svg>
);
const DocumentIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>문서 아이콘</title>
		<path
			fillRule="evenodd"
			d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75-4.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"
			clipRule="evenodd"
		/>
		<path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
	</svg>
);

interface ExpandableCellProps {
	value: string | number;
	expandable?: boolean;
	depth?: number;
	canExpand?: boolean;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
}

export const ExpandableCell = ({
	value,
	expandable = true,
	depth = 0,
	canExpand = false,
	isExpanded = false,
	onToggleExpand,
}: ExpandableCellProps) => {
	return (
		<div
			style={{
				paddingLeft: expandable ? `${depth * 2}rem` : undefined,
			}}
		>
			<div className="relative flex items-center">
				{/* 하위 항목이 있을 때만 세로 연결선 표시 */}
				{expandable && depth > 0 && (
					<div
						className="absolute border-gray-300 border-l"
						style={{
							left: `-${(depth - 1) * 2 + 1.25}rem`, // 상위 폴더 아이콘의 중앙
							top: "0rem", // 상위 폴더 아이콘의 하단에서 시작
							height: "0.875rem", // 현재 아이콘의 중앙까지
							width: "1px",
						}}
					/>
				)}

				{/* 수평 연결선 */}
				{expandable && depth > 0 && (
					<div
						className="absolute border-gray-300 border-t"
						style={{
							left: `-${(depth - 1) * 2 + 1.25}rem`, // 상위 폴더 중앙에서 시작
							top: "0.875rem", // 아이콘 중앙 높이
							width: `${(depth - 1) * 2 + 0.875}rem`, // 현재 아이콘까지의 거리
						}}
					/>
				)}
				{expandable && canExpand ? (
					<div
						{...{
							onClick: onToggleExpand,
							style: { cursor: "pointer" },
						}}
						className="mr-3 flex h-7 w-7 items-center justify-center rounded-md border border-yellow-200 text-yellow-500 transition-all duration-200 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-600"
					>
						{isExpanded ? (
							<FolderOpenIcon className="h-5 w-5" />
						) : (
							<FolderClosedIcon className="h-5 w-5" />
						)}
					</div>
				) : expandable && !canExpand ? (
					<div className="mr-3 flex h-7 w-7 items-center justify-center text-primary">
						<DocumentIcon className="h-5 w-5" />
					</div>
				) : !expandable ? (
					<div className="mr-3 flex h-7 w-7 items-center justify-center text-primary">
						<DocumentIcon className="h-5 w-5" />
					</div>
				) : null}
				<span>{String(value)}</span>
			</div>
		</div>
	);
};
