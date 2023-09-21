import { USER_EDIT_PATH } from '@constants'
import { useCoCRouter } from '@hooks'
import { DataGridButton } from '@kimjwally/ui'
import { User } from '__generated__/graphql'

export const useLeftButtons = () => {
  const router = useCoCRouter()

  const leftButtons: DataGridButton<Partial<User>>[] = [
    {
      text: '생성',
      onClick: () => {
        router.push({
          url: USER_EDIT_PATH,
          params: {
            userId: 'new',
          },
        })
      },
      props: { variant: 'solid', color: 'primary' },
    },
  ]

  return leftButtons
}
