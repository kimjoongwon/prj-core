import { Card, CardHeader, Divider, CardBody } from '@heroui/react';
import { Text } from '@shared/frontend';

export const DataGridLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="flex-1 flex-col">
      <CardHeader>
        <Text variant="h6">리스트</Text>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-1 flex-col space-y-2">{children}</CardBody>
    </Card>
  );
};
