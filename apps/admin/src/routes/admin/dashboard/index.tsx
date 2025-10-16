import { Spacer, Text, VStack } from "@cocrepo/ui";
import { createFileRoute } from "@tanstack/react-router";

const DashboardIndexRouteComponent = () => {
  return (
    <VStack className="space-y-4">
      <Spacer size={4} />
      <Text
        variant="h1"
        className="text-center font-bold text-2xl text-gray-800"
      >
        대시보드에 오신 것을 환영합니다!
      </Text>
      <Spacer size={2} />
      <Text variant="body1" className="text-center text-gray-600">
        워크스페이스가 성공적으로 선택되었습니다.
      </Text>
      <Spacer size={4} />
    </VStack>
  );
};

export const Route = createFileRoute("/admin/dashboard/")({
  component: DashboardIndexRouteComponent,
});
