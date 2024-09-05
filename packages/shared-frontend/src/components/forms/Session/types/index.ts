import { CreateSessionDto } from '../../../../model/createSessionDto';
import { UpdateSessionDto } from '../../../../model/updateSessionDto';

export interface SessionFormProps extends SessionFormViewProps {}

export interface SessionFormViewProps {
  state: CreateSessionDto | UpdateSessionDto;
}
