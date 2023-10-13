import './globals.css';
import { Providers } from './providers';

export default function RootLayout(props: {
  children: React.ReactNode;
  modalMount: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>라프첼라</title>
      </head>
      <body>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
