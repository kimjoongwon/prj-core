'use client';

import Link from 'next/link';
import { Github, Gitlab } from 'lucide-react';
import {
  Button,
  EmailInput,
  getToken,
  LoginPayloadDto,
  PasswordInput,
  SubmitButton,
  Text,
  useGetAdminAuthLoginRoute,
} from '@shared/frontend';
import { Card, CardBody, CardFooter, CardHeader, Form } from '@heroui/react';
import { PageBuilder } from '@shared/types';
import { observable } from 'mobx';
import { useRouter } from 'next/navigation';

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
    <Form onInvalid={() => console.log('invalid')}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <Text className="text-2xl font-bold text-center">로그인</Text>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <Text>이메일</Text>
              <EmailInput
                state={state}
                path="form.inputs.email"
                validation={page.form?.validations?.email}
              />
            </div>
            <div className="space-y-2">
              <Text>비밀번호</Text>
              <PasswordInput
                state={state}
                path="form.inputs.password"
                validation={page.form?.validations?.password}
              />
            </div>
            <SubmitButton
              state={state}
              path="form.inputs"
              variant="solid"
              color="primary"
              onPress={onPressLogin}
              validations={page.form?.validations!}
            >
              로그인
            </SubmitButton>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  또는 계속하기
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="bordered">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="bordered">
                <Gitlab className="h-4 w-4" />
              </Button>
              <Button variant="bordered">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M178.7,127.3,229,77.1l-87.1-64.3L38.8,77.1,89,127.3,38.8,178.9l103.1,64.3,87.1-64.3Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              비밀번호를 잊으셨나요?
            </Link>
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Form>
  );
}
