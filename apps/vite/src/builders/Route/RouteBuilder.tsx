import { RouteBuilder as RouteBuilderInterface } from '@shared/types';
import { LayoutBuilder } from '../LayoutBuilder/LayoutBuilder';
import { PageBuilder } from '../Page/PageBuilder';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '@shared/stores';

interface RouteBuilderProps {
  routeBuilder: RouteBuilderInterface;
}

export const RouteBuilder = (props: RouteBuilderProps) => {
  const { routeBuilder } = props;
  const navigate = useNavigate();
  const store = useStore();
  if (!routeBuilder) {
    return null;
  }

  useEffect(() => {}, []);

  return (
    <LayoutBuilder layoutBuilder={routeBuilder.layout}>
      {routeBuilder.layout?.page && (
        <PageBuilder pageBuilder={routeBuilder.layout?.page} />
      )}
    </LayoutBuilder>
  );
};
