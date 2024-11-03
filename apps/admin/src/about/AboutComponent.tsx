import { useNavigate } from '@tanstack/react-router';

export function AboutComponent() {
  const navigate = useNavigate({
    from: '/',
  });

  navigate({
    to: '/about',
  });
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
