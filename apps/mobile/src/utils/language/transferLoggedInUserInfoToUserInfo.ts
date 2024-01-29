import {storage} from 'src/App';

export const transferLoggedInUserInfoToUserInfo = async () => {
  let loggedInUsername = await storage.get('loggedInUsername');
  let loggedInPassword = await storage.get('loggedInPassword');
  await storage.set('username', loggedInUsername ? loggedInUsername : '');
  await storage.set('password', loggedInPassword ? loggedInPassword : '');
};
