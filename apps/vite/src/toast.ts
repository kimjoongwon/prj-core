import { toast, ToastContent, ToastOptions } from 'react-toastify';

export const Toast = {
  show: (
    content: ToastContent<unknown>,
    options?: ToastOptions<unknown> | undefined,
  ) => toast(content, options),
};
