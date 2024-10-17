import { UpdateSessionDto } from '../../../../model';

export interface SessionFormProps {
  state: Omit<UpdateSessionDto, 'id'> & {
    local: {
      rangeMode: boolean;
      oneTimeDate: string | undefined;
      oneTimeStartDate: string | undefined;
      oneTimeEndDate: string | undefined;
    };
  };
}

export interface SessionFormViewProps extends SessionFormProps {}
