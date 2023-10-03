'use client';

import { Button } from '@kimjwally/ui';
import { usePage } from './provider/hooks/usePage';

export default function Page() {
  const page = usePage();

  return (
    <div>
      <Button color="primary" onClick={page.meta.onClickEdit}>
        Edit
      </Button>
      <Button color="secondary" onClick={page.meta.onClickList}>
        List
      </Button>
    </div>
  );
}
