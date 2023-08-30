'use client'
import { Navbar } from '@kimjwally/ui'
import { USER_PAGE_PATH, useCoCRouter } from 'app/shared/hooks/useCoCRouter'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getUrlWithParams } = useCoCRouter()

  const items = [
    {
      text: '회원관리',
      href: getUrlWithParams(USER_PAGE_PATH, { userId: 'test' }),
    },
    {
      text: '기능2',
      href: 'login',
    },
  ]

  return (
    <div>
      <Navbar navItems={items} navMenuItems={items} />
      {children}
    </div>
  )
}
