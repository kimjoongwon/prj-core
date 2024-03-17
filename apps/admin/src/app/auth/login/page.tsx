'use client';

import { Button, LoginForm, Spacer } from '@coc/web';
import { useCoCRouter } from '@hooks';
import { observer } from 'mobx-react-lite';
import { authStore } from '@stores';
import { useAuthServiceLogin } from '../../../api/queries';

function LoginPage() {
  const router = useCoCRouter();

  const { mutate: login } = useAuthServiceLogin();

  const onClickLogin = () => {
    login(
      {
        requestBody: authStore.loginForm,
      },
      {
        onSuccess(data, variables, context) {
          console.log(data.accessToken);
        },
      },
    );
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
      <Button fullWidth onClick={onClickLogin}>
        로그인
      </Button>
    </div>
  );
}

export default observer(LoginPage);
