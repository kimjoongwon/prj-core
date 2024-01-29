import {View as BaseView, ViewProps as BaseViewProps} from 'react-native';

interface ViewProps extends BaseViewProps {}
export const View = (props: ViewProps) => {
  return <BaseView {...props} />;
};
