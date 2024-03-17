import { PageModal } from '@coc/web';
import { SpaceEditPageProvider } from '../../../../[spaceId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <PageModal>
      <SpaceEditPageProvider>{children}</SpaceEditPageProvider>
    </PageModal>
  );
}
