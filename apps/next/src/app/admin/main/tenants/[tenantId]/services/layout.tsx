'use client';

import { BottomTab } from '@/components/ui/BottomTab/BottomTab';
import { Header } from '@/components/ui/Header/Header';
import { Card, Spacer } from '@heroui/react';
import { VStack } from '@shared/frontend';

interface ServicesLayoutProps {
  children: React.ReactNode;
}

const ServicesLayout = (props: ServicesLayoutProps) => {
  const { children } = props;

  return (
    <VStack className="flex-1 w-full h-full">
      <Header />
      <Spacer y={1} />
      {children}
      <Card className="absolute bottom-0 w-full flex sm:hidden h-[64px] justify-center items-center rounded-t-none rounded-b-none">
        <BottomTab />
      </Card>
    </VStack>
  );
};

export default ServicesLayout;
