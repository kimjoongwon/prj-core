import { CoCModal } from '@coc/ui';
import { WorkspaceEditPageProvider } from '../../../../[workspaceId]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <CoCModal>
      <WorkspaceEditPageProvider>{children}</WorkspaceEditPageProvider>
    </CoCModal>
  );
}
