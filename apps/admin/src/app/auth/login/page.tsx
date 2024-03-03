'use client';

import { LoginForm, Spacer } from '@coc/shared';
import { useCoCRouter } from '@hooks';
import { observer } from 'mobx-react-lite';
import { authStore } from '@stores';
import { useAuthServiceLogin } from '../../../api/queries';

function LoginPage() {
  const router = useCoCRouter();

  const { mutate } = useAuthServiceLogin();

  const onClickLogin = () => {
    mutate(, {});
  };

  return (
    <div className="w-[720px]">
      <div className="w-full h-40 flex items-center justify-center">
        <div className="font-bold text-4xl text-primary-700">
          PROMISE
        </div>
      </div>
      <LoginForm state={authStore.loginForm} />
      <Spacer y={8} />
      {/* <Button
        size="lg"
        fullWidth
        onClick={() =>
          login(() => router.push({ url: DASHBOARD_PAGE_PATH }))
        }
        isLoading={isLoginLoading}
      >
        로그인
      </Button> */}
    </div>
  );
}

export default observer(LoginPage);
