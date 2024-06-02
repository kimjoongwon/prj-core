import { Text } from '../Text';

interface MessageProps {
  title: string;
  message: string;
}

export const Message = (props: MessageProps) => {
  const { message, title } = props;
  return (
    <div
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
      role="alert"
    >
      <Text className="font-bold">{title}</Text>
      <Text>{message}</Text>
    </div>
  );
};
