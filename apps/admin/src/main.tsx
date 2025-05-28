import ReactDOM from 'react-dom/client';
import { Providers } from './Providers';
import { App } from './App';

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <Providers>
      <App />
    </Providers>,
  );
}
