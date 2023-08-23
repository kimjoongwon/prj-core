import { Button, Navbar } from '@kimjwally/ui'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const items = [
    {
      text: '기능1',
      href: 'dashboard',
    },
    {
      text: '기능2',
      href: 'login',
    },
  ]

  return (
    <div>
      <Navbar items={items} />
      {children}
    </div>
  )
}
