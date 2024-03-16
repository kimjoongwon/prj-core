'use client';

import { Button, Input } from '@coc/shared';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const onClickGoToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div>
      <Input variant="bordered" placeholder="hi" />
      <Input variant="bordered" placeholder="hi" />
      <Input variant="bordered" placeholder="hi" />
      <Button size="lg" onClick={onClickGoToLogin}>
        로그인 페이지
      </Button>
    </div>
  );
}
