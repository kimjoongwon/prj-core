import { RouteBuilder } from '@shared/types';
import { Layout } from '../Layout';
import { Page } from '../Page';

interface RouteBuilderProps {
  routeBuilder: RouteBuilder;
}

export const Route = (props: RouteBuilderProps) => {
  const { routeBuilder } = props;
  if (!routeBuilder) {
    return null;
  }

  return (
    <Layout layoutBuilder={routeBuilder.layout}>
      {routeBuilder.layout?.page && (
        <Page pageBuilder={routeBuilder.layout?.page} />
      )}
    </Layout>
  );
};
