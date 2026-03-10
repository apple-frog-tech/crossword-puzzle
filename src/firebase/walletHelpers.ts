import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_KEY = (uid: string) => `user_wallet:${uid}`;

export type WalletState = {
  coins: number;
  lastSpinTs?: number;
  lastDailyBonusDate?: string; // YYYY-MM-DD
};

export async function loadLocalWallet(
  uid: string,
): Promise<WalletState | null> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_KEY(uid));
    if (!raw) return null;
    return JSON.parse(raw) as WalletState;
  } catch (e) {
    console.warn('loadLocalWallet failed', e);
    return null;
  }
}

export async function saveLocalWallet(uid: string, state: WalletState) {
  try {
    await AsyncStorage.setItem(LOCAL_KEY(uid), JSON.stringify(state));
  } catch (e) {
    console.warn('saveLocalWallet failed', e);
  }
}

export async function readRemoteWallet(uid: string): Promise<WalletState> {
  const snap = await database().ref(`users/${uid}/profile`).once('value');
  const val = snap.val() || {};
  return {
    coins: val.coins ?? 0,
    lastSpinTs: val.lastSpinTs ?? undefined,
    lastDailyBonusDate: val.lastDailyBonusDate ?? undefined,
  };
}

export async function awardCoinsTransactional(
  uid: string,
  amount: number,
  fieldsToSet?: { lastSpinTs?: any; lastDailyBonusDate?: string },
) {
  const ref = database().ref(`users/${uid}/profile`);

  const resultSnap = await ref.transaction(
    cur => {
      if (!cur) cur = {};
      cur.coins = (cur.coins || 0) + amount;
      if (fieldsToSet?.lastSpinTs !== undefined)
        cur.lastSpinTs = fieldsToSet.lastSpinTs;
      if (fieldsToSet?.lastDailyBonusDate !== undefined)
        cur.lastDailyBonusDate = fieldsToSet.lastDailyBonusDate;
      return cur;
    },
    undefined,
    true,
  );

  const newVal = resultSnap.snapshot.val() || {};
  return {
    coins: newVal.coins ?? 0,
    lastSpinTs: newVal.lastSpinTs ?? undefined,
    lastDailyBonusDate: newVal.lastDailyBonusDate ?? undefined,
  } as WalletState;
}
