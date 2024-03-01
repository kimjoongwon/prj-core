'use client';

import { Button } from '@coc/shared';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  return (
    <div>
      loginPage<Button onClick={() => router.back()}>뒤로가기</Button>
    </div>
  );
}

Login.displayName = 'Login';
