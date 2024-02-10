import { PageModal } from '@coc/shared';
import { SpaceEditPageProvider } from '../../../../[spaceId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <PageModal>
      <SpaceEditPageProvider>{children}</SpaceEditPageProvider>
    </PageModal>
  );
}
