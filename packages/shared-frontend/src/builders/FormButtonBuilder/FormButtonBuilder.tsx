import { Button } from '@shared/frontend';
import { ButtonBuilder } from '../ButtonBuilder';
import { PageBuilder } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';

interface FormButtonBuilderProps {
  pageBuilder: PageBuilder;
}

export const FormButtonBuilder = observer((props: FormButtonBuilderProps) => {
  const { pageBuilder } = props;
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 w-full justify-between px-1">
      <Button color="danger" onPress={() => navigate(-1)} size="lg">
        취소
      </Button>
      {pageBuilder.form?.button && (
        <ButtonBuilder buttonBuilder={pageBuilder.form.button} size="lg" />
      )}
    </div>
  );
});
