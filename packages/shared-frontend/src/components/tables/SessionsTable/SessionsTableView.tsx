import { SessionDto } from '../../../model/sessionDto';

interface SessionsTableProps {
  sessions: SessionDto[];
}

export const SessionsTable = (props: SessionsTableProps) => {
  const { sessions } = props;
  console.log(sessions);
  return <div>Table</div>;
};
