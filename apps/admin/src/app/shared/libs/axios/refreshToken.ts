// if (!isValidToken(token || '') && token) {
//   const query = await axios({
//     url: process.env.NEXT_PUBLIC_API_URL,
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: {
//       query: `
//           mutation RefreshToken($token: JWT!) {
//             refreshToken(token: $token) {
//               accessToken
//               refreshToken
//             }
//           }
//         `,
//       variables: {
//         token: localStorage.getItem('refreshToken'),
//       },
//     },
//   });

//   localStorage.setItem(
//     'accessToken',
//     query.data?.data?.refreshToken?.accessToken,
//   );
//   localStorage.setItem(
//     'refreshToken',
//     query.data?.data?.refreshToken?.refreshToken,
//   );
// }
