---
to: src/app/admin/dashboard/<%= name %>/layout.tsx
unless_exists: true
---
import { PageProvider } from './provider';

export default function Layout(props: { children: React.ReactNode }) {
  return <PageProvider>{props.children}</PageProvider>;
}
