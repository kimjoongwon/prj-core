'use client'

import { useCoCRouter } from 'app/shared/hooks/useCoCRouter'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useCoCRouter()

  router.go({
    url: '/admin/dashboard/users/:userId',
    params: { userId: 'test' },
  })

  return <div>대시보드</div>
}
