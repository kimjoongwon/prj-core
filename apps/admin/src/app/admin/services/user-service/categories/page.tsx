'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

function CategoriesPage() {
  return (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <Listbox aria-label="Actions" onAction={key => alert(key)}>
        <ListboxItem key="new">New file</ListboxItem>
        <ListboxItem key="copy">Copy link</ListboxItem>
        <ListboxItem key="edit">Edit file</ListboxItem>
        <ListboxItem key="delete" className="text-danger" color="danger">
          Delete file
        </ListboxItem>
      </Listbox>
    </div>
  );
}

export default observer(CategoriesPage);
