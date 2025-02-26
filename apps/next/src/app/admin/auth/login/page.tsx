'use client';

import Link from 'next/link';
import {
  EmailInput,
  getToken,
  LoginPayloadDto,
  PasswordInput,
  SubmitButton,
  Text,
  useGetAdminAuthLoginRoute,
} from '@shared/frontend';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { PageBuilder } from '@shared/types';
import { useRouter } from 'next/navigation';
import { observable } from 'mobx';

export default function LoginPage() {
  const { data: response, isFetchedAfterMount } = useGetAdminAuthLoginRoute();
  const router = useRouter();

  const page = response?.data as PageBuilder<LoginPayloadDto>;

  const state = observable(page?.state!);

  if (!isFetchedAfterMount) {
    return null;
  }

  const onPressLogin = async () => {
    try {
      getToken(state.form?.inputs!);
    } catch (error) {
      console.error(error);
    }

    router.push('/admin/main/tenants');
  };

  return (
    <div className="flex flex-1 flex-col w-full justify-center px-20">
      <Card>
        <CardHeader>
          <Text className="text-2xl font-bold text-center">로그인</Text>
        </CardHeader>
        <CardBody className="space-y-4">
          <EmailInput
            state={state}
            path="form.inputs.email"
            validation={page.form?.validations?.email}
          />
          <PasswordInput
            state={state}
            path="form.inputs.password"
            validation={page.form?.validations?.password}
          />
        </CardBody>
        <CardFooter className="flex flex-col space-y-2">
          <SubmitButton
            fullWidth
            state={state}
            path="form.inputs"
            variant="solid"
            color="primary"
            onPress={onPressLogin}
            validations={page.form?.validations!}
          >
            로그인
          </SubmitButton>
          <Link
            href="/forgot-password"
            className="text-sm text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            비밀번호를 잊으셨나요?
          </Link>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            계정이 없으신가요?
            <Link href="/signup" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
