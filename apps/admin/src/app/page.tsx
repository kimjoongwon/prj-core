import Link from 'next/link'
import { isServer } from './shared/utils/isServer'

// export const dynamic = 'force-dynamic'

// const GET_USERS = gql(`
//     query Users {
//       users {
//         id
//         email
//         profile {
//           nickname
//           phone
//         }
//       }
//     }
//   `)

export default function Page() {
  console.log('-----------------', isServer())

  return (
    <div>
      <div>---------</div>
      <Link href={'/dashboard'}>
        <button>이동</button>
      </Link>
      {/* <div>rendering은 됩니다.</div>
      {data?.users?.map((user) => (
        <div key={user.id}>{dayjs(user.profile.nickname).valueOf()}</div>
      ))} */}
    </div>
  )
}
