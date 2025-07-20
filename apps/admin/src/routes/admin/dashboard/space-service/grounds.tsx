import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const GroundsRouteComponent = () => {
  // Mock grounds data - in real app this would come from API
  const grounds = [
    { id: "1", name: "서울 그라운드", location: "서울시 강남구", capacity: "50명" },
    { id: "2", name: "부산 그라운드", location: "부산시 해운대구", capacity: "30명" },
    { id: "3", name: "대구 그라운드", location: "대구시 중구", capacity: "40명" },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">그라운드 리스트</h3>
      <Table aria-label="그라운드 테이블">
        <TableHeader>
          <TableColumn>이름</TableColumn>
          <TableColumn>위치</TableColumn>
          <TableColumn>수용인원</TableColumn>
        </TableHeader>
        <TableBody>
          {grounds.map((ground) => (
            <TableRow key={ground.id}>
              <TableCell>{ground.name}</TableCell>
              <TableCell>{ground.location}</TableCell>
              <TableCell>{ground.capacity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/space-service/grounds")({
  component: GroundsRouteComponent,
});