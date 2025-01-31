import { Card, CardBody } from '@heroui/react';

export const DataGridLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="flex-1 flex-col">
      <CardBody className="flex flex-1 flex-col space-y-2">{children}</CardBody>
    </Card>
  );
};
