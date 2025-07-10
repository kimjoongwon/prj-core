import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Providers } from './Providers';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <Providers>
      <App />
    </Providers>
  );
}
