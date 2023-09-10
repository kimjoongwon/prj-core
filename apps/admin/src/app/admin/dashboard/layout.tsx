'use client'
import { Navbar } from '@kimjwally/ui'
import { useCoCRouter } from 'app/shared/hooks/useCoCRouter'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getUrlWithParams } = useCoCRouter()

  const items = [
    {
      text: '사용자관리 > 교육생목록(세부 유저 유형)',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
    {
      text: '사용자관리 > 강사목록(세부 유저 유형)',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
    {
      text: '사용자관리 > 사원목록(세부 유저 유형)',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
    {
      text: '사용자관리 > 유저목록(세부 유저 유형)',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
    {
      text: '사용자그룹관리 > 유형목록(세부 유저 유형)',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
    {
      text: '사용자그룹관리 > 사용자그룹목록',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
    {
      text: '소속관리 > 소속 목록',
      href: getUrlWithParams('/admin/dashboard/users'),
    },
  ]

  return (
    <div>
      <Navbar navItems={items} navMenuItems={items} />
      {children}
    </div>
  )
}
