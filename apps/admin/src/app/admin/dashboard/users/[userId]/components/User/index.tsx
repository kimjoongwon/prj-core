import { Button } from '@coc/ui';
import { usePage } from '../Provider/hooks/usePage';

export const User = () => {
  const page = usePage();
  console.log('다국적 서비스를 만드는 방법?');
    
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
