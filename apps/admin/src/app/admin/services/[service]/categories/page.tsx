'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import { HStack, useGetCategories } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
function CategoriesPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: queryData } = useGetCategories(serviceId);
  const categories = queryData?.data;

  return (
    <HStack>
      <Listbox aria-label="Actions" onAction={key => alert(key)}>
        <ListboxItem key="new">New file</ListboxItem>
        <ListboxItem key="copy">Copy link</ListboxItem>
        <ListboxItem key="edit">Edit file</ListboxItem>
        <ListboxItem key="delete" className="text-danger" color="danger">
          Delete file
        </ListboxItem>
      </Listbox>
    </HStack>
  );
}

export default observer(CategoriesPage);
