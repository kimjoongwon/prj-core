import Link from 'next/link';

export default function Page() {
  return (
    <Link href="auth/login">
      <p>진입 경로입니다.</p>
    </Link>
  );
}
