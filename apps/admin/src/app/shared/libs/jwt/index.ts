import Jwt, { JwtPayload } from 'jsonwebtoken';
export const isTokenExpired = (token: string) => {
  const decodedToken = Jwt.decode(token) as JwtPayload;
  const { exp } = decodedToken;

  if (!exp) {
    return true;
  }

  const now = new Date().getTime();
  const expTimestamp = new Date(exp * 1000).getTime();

  return now > expTimestamp;
};
