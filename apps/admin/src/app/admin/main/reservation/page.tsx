'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import { FiChevronRight } from 'react-icons/fi';

const ReservationPage = () => {
  return (
    <Listbox variant="solid">
      <ListboxItem
        key={'sessions'}
        description="운동 프로그램의 세션을 생성 관리 합니다."
        endContent={<FiChevronRight />}
      >
        세션 관리
      </ListboxItem>
      <ListboxItem
        key={'timelineItems'}
        description="운동 프로그램의 타임라인을 관리"
        endContent={<FiChevronRight />}
      >
        타임라인 관리
      </ListboxItem>
    </Listbox>
  );
};

export default ReservationPage;

export const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      className,
      'flex items-center rounded-small justify-center w-7 h-7',
    )}
  >
    {children}
  </div>
);
