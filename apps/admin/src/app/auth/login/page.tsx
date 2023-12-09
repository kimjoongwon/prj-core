'use client';

import { Button, LoginForm, Spacer } from '@coc/ui';
import { useAccount } from '@hooks';
import { observer } from 'mobx-react-lite';

function Page() {
  const account = useAccount();

  return (
    <>
      <div className="w-full h-40 flex items-center justify-center">
        <div className="font-bold text-4xl text-primary-700">PROMISE</div>
      </div>
      <LoginForm state={account.loginForm} />
      <Spacer y={8} />
      <Button fullWidth onClick={account.login} isLoading={account.loading}>
        로그인
      </Button>
    </>
  );
}

export default observer(Page);
