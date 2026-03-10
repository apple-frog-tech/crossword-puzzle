import { getApp } from '@react-native-firebase/app';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';

export async function ensureSignedInAnonymously(): Promise<string> {
  try {
    const app = getApp();
    const firebaseAuth = getAuth(app);

    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      console.log('Already signed in:', currentUser.uid);
      return currentUser.uid;
    }

    const result = await signInAnonymously(firebaseAuth);
    const user = result?.user ?? null;
    if (!user?.uid) {
      throw new Error('anonymous signIn returned no uid');
    }
    console.log('Anonymous sign-in success, uid=', user.uid);
    return user.uid;
  } catch (err) {
    console.warn('anonymous signIn failed', err);
    throw err;
  }
}
