import { Button } from '@shared/frontend';
import { ButtonBuilder } from '../ButtonBuilder';
import { useRouter } from 'next/navigation';
import { PageBuilder } from '@shared/types';
import { usePageState } from '../Page/PageBuilder';
import { observer } from 'mobx-react-lite';

interface FormButtonBuilderProps {
  pageBuilder: PageBuilder;
}

export const FormButtonBuilder = observer((props: FormButtonBuilderProps) => {
  const { pageBuilder } = props;
  const router = useRouter();

  return (
    <div className="flex flex-1 w-full justify-between px-1">
      <Button color="danger" onPress={() => router.back()} size="lg">
        취소
      </Button>
      {pageBuilder.form?.button && (
        <ButtonBuilder buttonBuilder={pageBuilder.form.button} size="lg" />
      )}
    </div>
  );
});
