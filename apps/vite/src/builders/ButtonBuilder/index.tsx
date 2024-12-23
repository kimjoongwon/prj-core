import { Button as BaseButton, APIManager } from '@shared/frontend';
import { ButtonBuilder, FormBuilder } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormState } from '../FormBuilder';
import { toast } from 'react-toastify';

interface ButtonProps {
  data?: unknown & { id: string };
  form?: FormBuilder;
  buttonBuilder: ButtonBuilder;
}

// 1. cell의 수정 버튼 -> resoureId를 가지고 수정
// 2. 폼의 저장,수정,추가 버튼가 -> body를 가지고 저장,수정,추가
// 3. 페이지의 버튼 -> ????
export const Button = observer((props: ButtonProps) => {
  const state = useFormState();
  const params = useParams();
  const { buttonBuilder, form, data } = props;
  const navigate = useNavigate();

  const onPress = async () => {
    const serviceId = window.location.pathname.split('/')[4];
    if (state?.body) {
      Object.keys(state.body).map(key => {
        if (key?.split('.')?.includes('serviceId')) {
          state.body[key] = serviceId;
        }
        if (key.split('.').includes('parentId')) {
          state.body[key] = params.parentId;
        }
      });
    }

    const resourceId = params[form?.button.mutation?.resourceId as string];

    const args = [];
    if (resourceId) {
      args.push(resourceId);
    }

    if (state?.body) {
      args.push(state.body);
    }

    const button = toJS(buttonBuilder);
    const alert = button?.alert;
    const navigator = button?.navigator;
    try {
      if (button.mutation?.name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[button.mutation.name].apply(null, args);
      }

      if (alert) {
        toast(button.alert?.message);
      }

      if (navigator) {
        let params = {};
        const resourceId = data?.id;
        const isParnetId = navigator.pathname.includes('parentId');
        if (isParnetId) {
          params = { parentId: resourceId };
        } else {
          params = { resourceId };
        }

        const pathname = PathUtil.getUrlWithParamsAndQueryString(
          navigator.pathname,
          params,
        );

        navigate(pathname);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast(error.response?.data?.message || '');
      }
    }
  };

  return <BaseButton onPress={onPress}>{buttonBuilder.name}</BaseButton>;
});
