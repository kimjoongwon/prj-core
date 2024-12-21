import { Button as BaseButton, APIManager } from '@shared/frontend';
import { ButtonBuilder, FormBuilder } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { cloneDeep, set } from 'lodash-es';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormState } from '../FormBuilder';

interface ButtonProps {
  data?: unknown & { id: string };
  form?: FormBuilder;
  buttonBuilder: ButtonBuilder;
}

export const Button = observer((props: ButtonProps) => {
  const state = useFormState();
  const params = useParams();
  const { buttonBuilder, form, data } = props;
  const navigate = useNavigate();

  const onPress = async () => {
    const serviceId = window.location.pathname.split('/')[4];
    const body = cloneDeep(state.body);

    Object.entries(body).map(([key, value]) => {
      if (key.split('.')?.includes('serviceId')) {
        body[key] = serviceId;
      }
      set(body, key.split('.'), value);
    });
    console.log('body', body);
    const resourceId = params[form?.button.mutation?.resourceId as string];

    const args = [];
    if (resourceId) {
      args.push(resourceId);
    }

    if (body) {
      args.push(body);
    }

    const button = toJS(buttonBuilder);
    console.log('args', args);
    try {
      if (button.mutation?.name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[button.mutation.name].apply(null, args);
      }
      if (button?.success?.message) {
        alert(button.success.message);
      }

      if (button?.success?.link) {
        let params = {};

        if (button.success.keysForConvertPayloadsToParams) {
          params = button.success.keysForConvertPayloadsToParams?.reduce(
            (acc, key) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              acc[key] = data?.id;
              return acc;
            },
            {},
          );
          console.log('params', params);
          const pathname = PathUtil.getUrlWithParamsAndQueryString(
            button.success.link,
            params,
          );

          navigate(pathname);

          return;
        }
        navigate(button.success.link);
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && button.failure) {
        alert(button.failure.message);
        if (button.failure?.link) {
          navigate(button.failure?.link);
        }
      }
    }
  };

  return <BaseButton onPress={onPress}>{buttonBuilder.name}</BaseButton>;
});
