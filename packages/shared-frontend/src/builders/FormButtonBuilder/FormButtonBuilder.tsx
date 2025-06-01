import { ButtonBuilder } from '../ButtonBuilder';
import { PageBuilder } from '@shared/specs';
import { observer } from 'mobx-react-lite';

interface FormButtonBuilderProps {
  pageBuilder: PageBuilder;
}

export const FormButtonBuilder = observer((props: FormButtonBuilderProps) => {
  const { pageBuilder } = props;

  return <ButtonBuilder {...pageBuilder.form.button} />;
});
