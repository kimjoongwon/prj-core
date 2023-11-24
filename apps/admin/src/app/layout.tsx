import './globals.css';
import '@coc/ui/styles.css';
import { Providers } from './providers';

export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <title>라프첼라</title>
      </head>
      <body>
        <Providers>
          {props.children}
          {props.modal}
        </Providers>
      </body>
    </html>
  );
}
