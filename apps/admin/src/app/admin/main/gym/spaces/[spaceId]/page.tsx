'use client';

import { Card, Meta, Spacer, Text } from '@shared/frontend';
import { useSpacePage } from './_hooks/useSpacePage';
import { Divider } from '@nextui-org/react';

const SpacePage = () => {
  const { space } = useSpacePage();
  return (
    <Card className="p-4 space-y-4">
      <Text variant="h3">그룹 편집</Text>
      <Spacer y={8} />
      <Meta name={'공간명'} value={space?.name || ''} />
      <Divider />
    </Card>
  );
};

export default SpacePage;
