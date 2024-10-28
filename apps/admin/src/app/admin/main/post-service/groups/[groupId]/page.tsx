'use client';

import { AssignmentsTable, Button, Meta, Text } from '@shared/frontend';
import { useGroupPage } from './_hooks/useGroupPage';
import { Card } from '@mui/material';
import { Divider, Spacer } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

const GroupPage = observer(() => {
  const {
    onClickAdd,
    queries: { group, service, assignments, isLoading },
  } = useGroupPage();

  if (isLoading) {
    return null;
  }

  return (
    <Card variant="outlined" className="p-4 space-y-4">
      <Text variant="h3">{service?.label} 그룹</Text>
      <Spacer y={8} />
      <Meta name={'서비스 명'} value={service?.name || ''} />
      <Divider />
      <Meta name={'그룹 명'} value={group?.name || ''} />
      <Divider />
      <Button color="primary" onClick={onClickAdd}>
        {service?.label} 추가
      </Button>
      <AssignmentsTable hideButtons assignments={assignments} />
    </Card>
  );
});

export default GroupPage;
