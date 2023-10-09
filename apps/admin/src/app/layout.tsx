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
      <body className="flex flex-col">
        <Providers>
          <div className="flex flex-col">{props.children}</div>
        </Providers>
      </body>
    </html>
  );
}
