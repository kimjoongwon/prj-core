import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const CategoriesRouteComponent = () => {
  // Mock categories data - in real app this would come from API
  const categories = [
    { id: "1", name: "축구장", description: "축구 경기를 위한 공간", groundCount: "5개" },
    { id: "2", name: "농구장", description: "농구 경기를 위한 공간", groundCount: "3개" },
    { id: "3", name: "테니스장", description: "테니스 경기를 위한 공간", groundCount: "4개" },
    { id: "4", name: "배드민턴장", description: "배드민턴 경기를 위한 공간", groundCount: "6개" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">카테고리 리스트</h3>
        <Button color="primary" size="sm">카테고리 추가</Button>
      </div>
      <Table aria-label="카테고리 테이블">
        <TableHeader>
          <TableColumn>이름</TableColumn>
          <TableColumn>설명</TableColumn>
          <TableColumn>그라운드 수</TableColumn>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.groundCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/space-service/categories")({
  component: CategoriesRouteComponent,
});