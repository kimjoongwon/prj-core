import { UpdateSessionDto } from '../../../../model';

export interface SessionFormProps extends SessionFormViewProps {}

export interface SessionFormViewProps {
  state: UpdateSessionDto & {
    rangeMode: boolean;
    oneTImeDate: string | undefined;
    oneTimeStartDate: string | undefined;
    oneTimeEndDate: string | undefined;
  };
}
