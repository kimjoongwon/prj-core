import { UpdateSessionDto } from '../../../../model';

export interface SessionFormProps {
  state: Omit<UpdateSessionDto, 'id'> & {
    local: {
      rangeMode: boolean;
      oneTImeDate: string | undefined;
      oneTimeStartDate: string | undefined;
      oneTimeEndDate: string | undefined;
    };
  };
}

export interface SessionFormViewProps extends SessionFormProps {}
