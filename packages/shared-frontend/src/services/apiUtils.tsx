import { APIManager } from '@shared/frontend';
import { addToast } from '@heroui/react';
import { isAxiosError } from 'axios';
import { getQueryClient } from '@shared/frontend';
import { ButtonResponse } from '@shared/specs';
import { ReactNode } from 'react';

type ToastConfig = {
  title: ReactNode;
  description: ReactNode;
};

type ButtonResponseWithReactNode<T = any> = Omit<ButtonResponse<T>, 'toast'> & {
  toast: {
    state: 'success' | 'danger';
    title: ReactNode;
    description: ReactNode;
  };
};

/**
 * Executes an API call using the provided apiKey
 *
 * @param apiKey - The key of the API function to call in the APIManager
 * @param args - Arguments to pass to the API function
 * @param invalidationKey - Optional key to invalidate queries after successful API call
 * @param successToast - Optional custom success toast configuration
 * @param errorToast - Optional custom error toast configuration
 * @returns A promise resolving to a ButtonResponse object
 */
export async function executeApiCall<T = any>(
  apiKey: string,
  invalidationKey?: string,
  successToast: ToastConfig = {
    title: '성공',
    description: '작업이 완료되었습니다.',
  },
  errorToast: ToastConfig = {
    title: '오류',
    description: '작업 중 오류가 발생했습니다.',
  },
): Promise<ButtonResponseWithReactNode<T>> {
  try {
    const apiFunction = APIManager[apiKey as keyof typeof APIManager];

    if (!apiFunction) {
      console.error(
        `API function with key "${apiKey}" not found in APIManager`,
      );

      addToast({
        title: errorToast.title,
        description: <>API 함수를 찾을 수 없습니다: {apiKey}</>,
        color: 'danger',
      });

      return {
        toast: {
          state: 'danger',
          title: errorToast.title,
          description: <>API 함수를 찾을 수 없습니다: {apiKey}</>,
        },
      };
    }

    const response = await (apiFunction as Function)();
    const responseData = response?.data;

    if (invalidationKey) {
      getQueryClient().invalidateQueries({
        queryKey: [invalidationKey],
      });
    }

    addToast({
      title: successToast.title,
      description: successToast.description,
    });

    return {
      routeName: responseData?.routeName,
      state: responseData,
      toast: {
        state: 'success',
        title: successToast.title,
        description: successToast.description,
      },
    };
  } catch (error: unknown) {
    console.error('API call error:', error);

    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message;
      const errorMessages = error.response?.data?.data?.message;

      let description: ReactNode = errorToast.description;

      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        description = (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errorMessages.map((msg: string, idx: number) => (
              <li key={idx}>
                <span style={{ marginRight: 4, color: '#888' }}>•</span>
                {msg}
              </li>
            ))}
          </ul>
        );
      } else if (errorMessage) {
        description = errorMessage;
      }

      addToast({
        title: errorToast.title,
        description,
        color: 'danger',
      });

      return {
        toast: {
          state: 'danger',
          title: errorToast.title,
          description,
        },
      };
    } else {
      addToast({
        title: errorToast.title,
        description: errorToast.description,
        color: 'danger',
      });

      return {
        toast: {
          state: 'danger',
          title: errorToast.title,
          description: errorToast.description,
        },
      };
    }
  }
}
