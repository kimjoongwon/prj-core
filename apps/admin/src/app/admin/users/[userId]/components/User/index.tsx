import { Button } from '@coc/web';
import { usePage } from '../Provider/hooks/usePage';

export const User = () => {
  const page = usePage();
    
  return (
    <>
      <Button color="primary" onClick={page.meta.onClickEdit}>
        Edit
      </Button>
      <Button color="secondary" onClick={page.meta.onClickList}>
        List
      </Button>
    </>
  );
};
