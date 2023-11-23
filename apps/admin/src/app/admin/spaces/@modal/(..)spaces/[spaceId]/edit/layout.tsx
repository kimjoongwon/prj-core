import { CoCModal } from '@coc/ui';
import { SpaceEditPageProvider } from '../../../../[spaceId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <CoCModal>
      <SpaceEditPageProvider>{children}</SpaceEditPageProvider>
    </CoCModal>
  );
}
