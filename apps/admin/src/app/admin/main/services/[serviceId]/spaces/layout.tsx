import React from 'react';
import { Container } from '@shared/frontend';
import { ServicePageParams } from '../page';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

export type SpacesPageParams = ServicePageParams;

const SpacesLayout = async (props: SpaceLayoutProps) => {
  const cookieStore = cookies();
  const access_token = cookieStore.get('accessToken');
  const authorization = headers().get('authorization');
  // console.log('header', header);
  console.log('access_token', access_token);
  let data = null;
  try {
    data = await fetch('http://localhost:3005/api/v1/admin/spaces', {
      headers: {
        Authorization: authorization!,
      },
      next: {
        tags: ['test'],
      },
    });
  } catch (error) {
    console.error(error);
  }
  let test = await data?.json();
  if (!data?.ok) {
    return <div>data.headers['Authorization']</div>;
  }

  async function invalidate() {
    'use server';
    // try {
    //   await fetch('http://localhost:3005/api/v1/admin/spaces');
    // } catch (error) {
    //   return false;
    //   console.error(error);
    // }
    revalidateTag('test');
  }

  return (
    <Container className="h-full">
      <form action={invalidate}>
        <div>{test.data.length}</div>
        <button>test</button>
        {/* {props.children} */}
      </form>
    </Container>
  );
};

export default SpacesLayout;
