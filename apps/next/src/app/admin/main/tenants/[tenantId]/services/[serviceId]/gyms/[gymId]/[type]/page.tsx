'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { Text } from '@shared/frontend';

const GymEditPage = () => {
  return (
    <Card fullWidth className="p-4">
      <CardHeader>
        <Text variant="h2">GYM</Text>
      </CardHeader>
      <CardBody>
        <Card fullWidth className="p-4">
          <Text>GYM 수정</Text>
        </Card>
      </CardBody>
    </Card>
  );
};

export default GymEditPage;
