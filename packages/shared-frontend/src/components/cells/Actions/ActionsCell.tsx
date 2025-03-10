import React from 'react';
import { Button, ButtonGroup } from '@heroui/react';
import { CellContext } from '@tanstack/react-table';

export const ActionsCell = (_props: CellContext<any, any>) => {
  return (
    <ButtonGroup>
      <Button>수정</Button>
      <Button>삭제</Button>
      <Button>추가</Button>
    </ButtonGroup>
  );
};
