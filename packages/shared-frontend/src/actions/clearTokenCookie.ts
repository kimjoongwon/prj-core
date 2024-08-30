'use server';
import { cookies } from 'next/headers';

export const clearTokenCookie = () => {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');
};
