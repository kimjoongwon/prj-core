'use client';

import { observer } from 'mobx-react-lite';
import { usePage } from '../PageProvider/hooks';

interface SectionProps {
  children?: React.ReactNode;
}
export const CategoryItemList = observer((props: SectionProps) => {
  const { children } = props;
  const page = usePage();

  return <div className="space-y-4">{children}</div>;
});
