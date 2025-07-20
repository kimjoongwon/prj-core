import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

const UsersRouteComponent = () => {
  // Mock user data - in real app this would come from API
  const users = [
    { id: "1", name: "김철수", phone: "010-1234-5678" },
    { id: "2", name: "이영희", phone: "010-2345-6789" },
    { id: "3", name: "박민수", phone: "010-3456-7890" },
    { id: "4", name: "최지원", phone: "010-4567-8901" },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 리스트</h3>
      <Table aria-label="사용자 테이블">
        <TableHeader>
          <TableColumn>이름</TableColumn>
          <TableColumn>전화번호</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/user-service/users")({
  component: UsersRouteComponent,
});