'use client';

import { Paper } from '@mui/material';
import { Button, HStack, Meta, VStack } from '@shared/frontend';
import { useHandlers, useQueries } from './_hooks';
import { useParams } from 'next/navigation';
import { Divider } from '@nextui-org/react';

const ServicePage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { service } = useQueries(serviceId);
  const { onClicKCategories, onClickGroups } = useHandlers();

  return (
    <Paper className="p-4 flex flex-col w-full items-center space-y-4">
      <Meta name={'이름'} value={service?.name || '-'} />
      <Meta name={'라벨'} value={service?.label || '-'} />
      <Divider />
      <VStack className="space-y-2 w-full">
        <Button fullWidth color="primary" variant='flat' onClick={onClicKCategories}>
          카테고리 관리
        </Button>
        <Button fullWidth color="primary" variant='flat' onClick={onClickGroups}>
          그룹 관리
        </Button>
      </VStack>
    </Paper>
  );
};

export default ServicePage;
