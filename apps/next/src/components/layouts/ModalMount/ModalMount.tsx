'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal as NextUIModal,
} from '@heroui/react';
import { Button, ILLIT, useGetMyGyms } from '@shared/frontend';
import { MyGymSelect } from '@/components/pages';
import { useRouter } from 'next/navigation';

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
        {modal.type === 'MyGymSelect' && <GymSelectModalBody />}
      </ModalContent>
    </NextUIModal>
  );
});

const GymSelectModalBody = observer(() => {
  const router = useRouter();
  const { data: getMyGymsResponse } = useGetMyGyms();
  const myGyms = getMyGymsResponse?.data || [];

  const localState = useLocalObservable(() => ({
    selectedGymId: '',
  }));

  const onPressSelect = () => {
    const selectedGym = myGyms.find(gym => gym.id === localState.selectedGymId);
    console.log('selectedGym', selectedGym);
    if (selectedGym) {
      localStorage.setItem('gym', JSON.stringify(selectedGym));
      localStorage.setItem('gymId', selectedGym.id);
    }
    router.push(`/admin/main/tenants/${selectedGym?.id}/services`);
    ILLIT.modal.destory();
  };

  return (
    <>
      <ModalBody>
        <MyGymSelect state={localState} path="selectedGymId" gyms={myGyms} />
      </ModalBody>
      <ModalFooter>
        <Button onPress={onPressSelect}>선택</Button>
      </ModalFooter>
    </>
  );
});
