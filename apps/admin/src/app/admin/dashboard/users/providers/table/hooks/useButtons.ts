import { useCoCRouter } from '@hooks'
import { GroupButton } from '@kimjwally/ui'
import { useMemo } from 'react'

export const useButtons = () => {
  const { getUrlWithParams } = useCoCRouter()

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
    {
      children: '생성',
      color: 'primary',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ]

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      href: getUrlWithParams('/admin/dashboard/users/:userId/edit', {
        userId: 'new',
      }),
    },
  ]

  return {
    rightButtons: useMemo(() => rightButtons, []),
    leftButtons: useMemo(() => leftButtons, []),
  }
}
