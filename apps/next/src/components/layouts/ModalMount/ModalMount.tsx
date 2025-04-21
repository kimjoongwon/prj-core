'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal as NextUIModal,
} from '@heroui/react';
import { Button, ILLIT, useGetGroundsByUserId } from '@shared/frontend';
import { useRouter } from 'next/navigation';
import { MyGroundSelect } from '@/components/pages';

export const ModalMount = observer(() => {
  const { modal } = ILLIT;

  return (
    <NextUIModal
      isDismissable
      onClose={() => (modal.open = false)}
      isOpen={modal.open}
    >
      <ModalContent>
        <ModalHeader>{modal.header}</ModalHeader>
        {modal.type === 'MyGroundSelect' && <GroundSelectModalBody />}
      </ModalContent>
    </NextUIModal>
  );
});

const GroundSelectModalBody = observer(() => {
  const router = useRouter();
  const userId = localStorage.getItem('userId') || '';
  const { data: getMyGroundsResponse } = useGetGroundsByUserId(userId);
  const myGrounds = getMyGroundsResponse?.data || [];

  const localState = useLocalObservable(() => ({
    selectedGroundId: '',
  }));

  const onPressSelect = () => {
    const selectedGround = myGrounds.find(
      ground => ground.id === localState.selectedGroundId,
    );
    console.log('selectedGround', selectedGround);
    if (selectedGround) {
      localStorage.setItem('ground', JSON.stringify(selectedGround));
      localStorage.setItem('groundId', selectedGround.id);
    }
    router.push(`/admin/main/tenants/${selectedGround?.id}/services`);
    ILLIT.modal.destory();
  };

  return (
    <>
      <ModalBody>
        <MyGroundSelect
          state={localState}
          path="selectedGroundId"
          grounds={myGrounds}
        />
      </ModalBody>
      <ModalFooter>
        <Button onPress={onPressSelect}>선택</Button>
      </ModalFooter>
    </>
  );
});
