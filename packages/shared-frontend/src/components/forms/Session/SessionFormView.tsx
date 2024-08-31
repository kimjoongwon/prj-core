import { CreateSessionDto, UpdateSessionDto } from '../../../model';

interface SessionFormViewProps {
  state: CreateSessionDto | UpdateSessionDto;
}
export const SessionFormView = (props: SessionFormViewProps) => {
  const { state } = props;
  console.log('state', state);
  return <div>SessionsForm</div>;
};
