import { Button, APIManager } from '@shared/frontend';
import { FormBuilder as FormBuilderState } from '@shared/types';
import { set, mergeWith } from 'lodash-es';
import { useNavigate } from 'react-router-dom';
import { notification } from '../NotificationBuilder';
import { isAxiosError } from 'axios';
import { toJS } from 'mobx';

interface FormBuilderProps {
  state: FormBuilderState;
  children: React.ReactNode;
}

export const FormBuilder = (props: FormBuilderProps) => {
  const { state, children } = props;
  const navigate = useNavigate();
  const onClick = async () => {
    const payloads = state.sections
      .map(section =>
        section.components.map(component => {
          console.log(component.path.split('.'));
          const paths = component.path.split('.');
          const result = set({}, paths, component.props.value);
          return result;
        }),
      )
      .flat();

    const mergedPayload = payloads.reduce(
      (acc, payload) => mergeWith(acc, payload as never),
      {},
    );

    console.log('mergedPayload', mergedPayload);

    try {
      if (state.button.flow.mutation) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await APIManager[state.button.flow.mutation](toJS(mergedPayload));
      }
      if (state.button.flow.try.message) {
        // store.snackbar.open = true;
        notification.message = state.button.flow.try.message;
      }
      if (state.button.flow.try.pathname) {
        navigate(state.button.flow.try.pathname);
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && state.button.flow.catch) {
        const errorMessage = error.response?.data?.message;
        if (state.button.flow) {
          notification.open = true;
          notification.message =
            errorMessage || state.button.flow.catch.message;
          if (state.button.flow.catch.pathname) {
            navigate(state.button.flow.catch.pathname);
          }
        }
      }
    } finally {
      if (state.button.flow.finally) {
        // Toast.show(state.button.flow.finally.message);
      }
    }
  };

  return (
    <form className="space-y-2">
      {children}
      <Button {...state.button} onClick={onClick} />
    </form>
  );
};
