interface ConfigCardProps {
	title: string;
	subtitle: string;
	icon: string;
	status: "active" | "inactive";
	onClick?: () => void;
}

export function ConfigCard({
	title,
	subtitle,
	icon,
	status,
	onClick,
}: ConfigCardProps) {
	const isActive = status === "active";

	return (
		<button
			onClick={onClick}
			disabled={!isActive}
			className={`
        relative p-6 rounded-xl border text-left transition-all duration-200
        ${
					isActive
						? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg cursor-pointer"
						: "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
				}
      `}
		>
			{/* 상태 표시 */}
			<div
				className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
					isActive ? "bg-green-500" : "bg-gray-400"
				}`}
			/>

			{/* 아이콘 */}
			<div className="text-4xl mb-3">{icon}</div>

			{/* 제목 */}
			<h3 className="text-lg font-semibold mb-1">{title}</h3>

			{/* 경로 */}
			<p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
				{subtitle}
			</p>

			{/* 상태 텍스트 */}
			<div className="mt-4">
				<span
					className={`text-xs px-2 py-1 rounded-full ${
						isActive
							? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
							: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
					}`}
				>
					{isActive ? "활성화됨" : "설정 없음"}
				</span>
			</div>
		</button>
	);
}
