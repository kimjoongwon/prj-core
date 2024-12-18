import { Button, APIManager } from '@shared/frontend';
import {
  ButtonBuilder as ButtonBuilderState,
  FormBuilder,
} from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { mergeWith, set } from 'lodash-es';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

interface ButtonBuilderProps {
  data?: unknown & { id: string };
  form?: FormBuilder;
  state: ButtonBuilderState;
}

export const ButtonBuilder = observer((props: ButtonBuilderProps) => {
  const params = useParams();
  const { state, form, data } = props;
  const navigate = useNavigate();

  console.log('params', params);

  const onPress = async () => {
    const serviceId = window.location.pathname.split('/')[4];
    const button = toJS(state);

    console.log('button', button);
    console.log('form', form);

    const payloads = form?.sections
      .map(section =>
        section.components.map(component => {
          const paths = component?.path?.split('.') || [];
          const result = set({}, paths, component.props.value);
          return result;
        }),
      )
      .flat();

    const mergedPayload =
      (payloads?.reduce(
        (acc, payload) => mergeWith(acc, payload as never),
        form?.defaultValues || {},
      ) as {
        [key: string]: unknown;
      }) || {};

    mergedPayload.serviceId = serviceId;
    try {
      if (button.mutation) {
        if (params?.type === 'add') {
          mergedPayload.parentId = params.id;
          console.log('mergedPayload', mergedPayload);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          await APIManager['create' + button.mutation](mergedPayload);
        } else if (params.type === 'edit') {
          if (params.id === 'new') {
            console.log('mergedPayload', mergedPayload);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await APIManager['update' + button.mutation](mergedPayload);
          } else {
            console.log('mergedPayload', mergedPayload);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await APIManager['update' + button.mutation](id, mergedPayload);
          }
        } else {
          console.log('mergedPayload', mergedPayload);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          await APIManager[button.mutation](mergedPayload);
        }
      }
      if (button?.success?.message) {
        alert(button.success.message);
      }

      if (button?.success?.link) {
        if (button.type === 'ROW') {
          const params = button.success.paramKeys?.reduce((acc, key) => {
            acc[key] = data?.id;
            return acc;
          }, {});
          navigate(
            PathUtil.getUrlWithParamsAndQueryString(
              button.success.link,
              params,
            ),
          );
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

  return <Button onPress={onPress}>{state.name}</Button>;
});
