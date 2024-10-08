'use client';

import { FormLayout, Input } from '@shared/frontend';
import { useProps } from './_hooks/useProps';

const GroupEditPage = () => {
  const { onClickList, onClickSave, state } = useProps();

  const leftButtons = [
    {
      children: '목록',
      onClick: onClickList,
    },
  ];
  const rightButtons = [
    {
      children: '저장',
      onClick: onClickSave,
    },
  ];

  return (
    <FormLayout
      title="그룹 생성/수정"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <Input state={state.form} label="그룹명" path="name" />
    </FormLayout>
  );
};

export default GroupEditPage;
