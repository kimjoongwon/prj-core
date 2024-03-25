'use client';

import { Button, HStack, VStack } from '@shared/frontend';

export default function Page() {
  return (
    <div style={{ height: 1000 }}>
      <HStack>
        <Button style={{ flex: 1 }}>Button</Button>
        <VStack>
          <Button>Button</Button>
          <Button>Button</Button>
        </VStack>
        <Button>Button</Button>
      </HStack>
      <HStack>
        <Button style={{ flex: 1 }}>Button</Button>
        <VStack>
          <Button>Button</Button>
          <Button>Button</Button>
        </VStack>
        <Button>Button</Button>
      </HStack>
    </div>
  );
}
