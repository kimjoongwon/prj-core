"use client";

import { Text } from "@cocrepo/ui";
import { useColumnVisibility } from "@/hooks";

/**
 * 컬럼 가시성 관리 페이지
 *
 * 각 엔티티(User, Reservation, Role 등)의 컬럼 가시성을
 * 디바이스별로 확인하고 관리할 수 있는 설정 페이지입니다.
 */
export default function ColumnsSettingsPage() {
	const userColumns = useColumnVisibility("User", "desktop");
	const reservationColumns = useColumnVisibility("Reservation", "desktop");
	const roleColumns = useColumnVisibility("Role", "desktop");

	return (
		<div className="space-y-6">
			<div>
				<Text variant="h1">컬럼 가시성 관리</Text>
				<Text variant="body2" className="mt-2 text-gray-600">
					각 엔티티의 컬럼 가시성을 디바이스별로 설정합니다.
				</Text>
			</div>

			{/* User 엔티티 */}
			<div className="bg-white rounded-lg shadow p-6">
				<Text variant="h2" className="mb-4">
					User 엔티티
				</Text>
				{userColumns.isLoading ? (
					<Text variant="body2">로딩 중...</Text>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										필드
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										라벨
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										필수
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Desktop
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tablet
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Mobile
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{userColumns.columns.map((col) => (
									<tr key={col.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{col.field}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.label}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.isRequired ? "✅" : ""}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnDesktop ? "✅" : "❌"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnTablet ? "✅" : "❌"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnMobile ? "✅" : "❌"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Reservation 엔티티 */}
			<div className="bg-white rounded-lg shadow p-6">
				<Text variant="h2" className="mb-4">
					Reservation 엔티티
				</Text>
				{reservationColumns.isLoading ? (
					<Text variant="body2">로딩 중...</Text>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										필드
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										라벨
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										필수
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Desktop
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tablet
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Mobile
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{reservationColumns.columns.map((col) => (
									<tr key={col.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{col.field}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.label}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.isRequired ? "✅" : ""}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnDesktop ? "✅" : "❌"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnTablet ? "✅" : "❌"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnMobile ? "✅" : "❌"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Role 엔티티 */}
			<div className="bg-white rounded-lg shadow p-6">
				<Text variant="h2" className="mb-4">
					Role 엔티티
				</Text>
				{roleColumns.isLoading ? (
					<Text variant="body2">로딩 중...</Text>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										필드
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										라벨
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										필수
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Desktop
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tablet
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Mobile
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{roleColumns.columns.map((col) => (
									<tr key={col.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{col.field}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.label}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.isRequired ? "✅" : ""}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnDesktop ? "✅" : "❌"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnTablet ? "✅" : "❌"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{col.visibleOnMobile ? "✅" : "❌"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
