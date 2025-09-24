import {
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

const GroundDetailMembersRouteComponent = () => {
	const { groundId } = Route.useParams();

	// Mock members data - in real app this would come from API
	const members = [
		{
			id: "1",
			name: "김철수",
			role: "관리자",
			joinDate: "2024-01-15",
			status: "active",
		},
		{
			id: "2",
			name: "이영희",
			role: "멤버",
			joinDate: "2024-02-20",
			status: "active",
		},
		{
			id: "3",
			name: "박민수",
			role: "멤버",
			joinDate: "2024-03-10",
			status: "inactive",
		},
		{
			id: "4",
			name: "최지원",
			role: "멤버",
			joinDate: "2024-04-05",
			status: "active",
		},
	];

	const getStatusColor = (status: string) => {
		return status === "active" ? "success" : "default";
	};

	const getStatusText = (status: string) => {
		return status === "active" ? "활성" : "비활성";
	};

	return (
		<div className="space-y-6">
			<h4 className="font-medium text-gray-900 text-lg">멤버 리스트</h4>

			<Table aria-label="그라운드 멤버 테이블">
				<TableHeader>
					<TableColumn>이름</TableColumn>
					<TableColumn>역할</TableColumn>
					<TableColumn>가입일</TableColumn>
					<TableColumn>상태</TableColumn>
				</TableHeader>
				<TableBody>
					{members.map((member) => (
						<TableRow key={member.id}>
							<TableCell>{member.name}</TableCell>
							<TableCell>{member.role}</TableCell>
							<TableCell>{member.joinDate}</TableCell>
							<TableCell>
								<Chip color={getStatusColor(member.status)} variant="flat">
									{getStatusText(member.status)}
								</Chip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export const Route = createFileRoute(
	"/admin/dashboard/space-service/grounds/$groundId/detail/members",
)({
	component: GroundDetailMembersRouteComponent,
});
