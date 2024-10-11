'use client';

import { Meta, Spacer, VStack } from '@shared/frontend';
import { useSpacePage } from './_hooks/useSpacePage';

const SpacePage = () => {
  const { space } = useSpacePage();
  return (
    <VStack className="flex-grow-0">
      <Spacer y={4} />
      <Meta name={'공간명'} value={space?.name || ''} />
    </VStack>
  );
};

export default SpacePage;
