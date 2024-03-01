import Fade from './Fade';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('template');
  return <Fade>{children}</Fade>;
}
