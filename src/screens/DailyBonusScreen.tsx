import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notify } from '../utils/notificationCenter';

const LOCAL_WALLET_KEY = "local_wallet_v2";

const REWARDS = [5, 15, 20, 35, 40, 55, 60];

type Wallet = {
  coins: number;
  streakDay: number; // 1-7
  lastDailyBonusDate?: string; // YYYY-MM-DD
};

const coinImg = require("../assets/coins.png"); 

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function DailyBonusScreen({ navigation }: any) {
  const [wallet, setWallet] = useState<Wallet>({
    coins: 0,
    streakDay: 1,
  });

  const [alreadyClaimedToday, setAlreadyClaimedToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LOCAL_WALLET_KEY);
        if (!raw) {
          setWallet({ coins: 0, streakDay: 1 });
          setLoading(false);
          return;
        }

        const saved: Wallet = JSON.parse(raw);
        const t = today();
        const y = yesterday();

        if (saved.lastDailyBonusDate === t) {
          setAlreadyClaimedToday(true);
        } else if (saved.lastDailyBonusDate === y) {
          saved.streakDay = Math.min(saved.streakDay + 1, 7);
        } else {
          saved.streakDay = 1;
        }

        setWallet(saved);
      } catch (e) {
        console.warn("load wallet failed", e);
      }
      setLoading(false);
    })();
  }, []);

  async function saveWallet(next: Wallet) {
    setWallet(next);
    await AsyncStorage.setItem(LOCAL_WALLET_KEY, JSON.stringify(next));
  }

  async function onCollect() {
     if (alreadyClaimedToday) {
   notify({ type: 'info', title: 'Already claimed', message: 'Come back tomorrow 😊', durationMs: 3000 });
   return;
 }

    const reward = REWARDS[wallet.streakDay - 1] ?? 0;
    const next: Wallet = {
      coins: (wallet.coins ?? 0) + reward,
      streakDay: wallet.streakDay,
      lastDailyBonusDate: today(),
    };

    await saveWallet(next);
    setAlreadyClaimedToday(true);

    notify({ type: 'success', title: 'Reward collected!', message: `You received +${reward} coins.`, durationMs: 3500 });
  }

  if (loading) return null;

  return (
    <LinearGradient
      colors={["#120826", "#2A1360"]}
      style={styles.container}
    >
      <View style={styles.cardBorder}>
        <View style={styles.card}>
          <Text style={styles.header}>Daily Bonus</Text>

          {/* --- Reward Grid --- */}
          <View style={styles.grid}>
            {REWARDS.map((reward, idx) => {
              const day = idx + 1;
              const claimed =
                wallet.lastDailyBonusDate === today()
                  ? day <= wallet.streakDay
                  : day < wallet.streakDay;
              const isToday = day === wallet.streakDay && !alreadyClaimedToday;

              return (
                <View key={idx} style={styles.gridItemWrap}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!isToday}
                    style={[
                      styles.rewardBox,
                      claimed && styles.boxClaimed,
                      !isToday && !claimed && styles.boxLocked,
                      isToday && styles.boxToday,
                    ]}
                  >
                    <Image source={coinImg} style={styles.coin} />
                    <Text style={styles.rewardText}>+{reward}</Text>
                  </TouchableOpacity>

                  <Text style={styles.dayLabel}>DAY {day}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            disabled={alreadyClaimedToday}
            onPress={onCollect}
            style={[
              styles.collectBtn,
              alreadyClaimedToday && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.collectText}>
              {alreadyClaimedToday ? "CLAIMED" : "COLLECT!"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.walletText}>Coins: {wallet.coins}</Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  cardBorder: {
    padding: 2,
    borderRadius: 16,
    backgroundColor: "#5AF1FF",
  },

  card: {
    backgroundColor: "rgba(12,12,30,0.95)",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    width: "88%",
  },

  header: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 16 },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 16,
  },

  gridItemWrap: {
    width: "30%",
    alignItems: "center",
    marginVertical: 8,
  },

  rewardBox: {
    width: 86,
    height: 72,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },

  boxClaimed: {
    backgroundColor: "#3BE36F33",
    borderColor: "#3BE36F",
  },

  boxLocked: {
    opacity: 0.4,
  },

  boxToday: {
    borderColor: "#5AF1FF",
    shadowColor: "#5AF1FF",
    shadowOpacity: 0.7,
  },

  coin: { width: 28, height: 28, marginBottom: 4 },

  rewardText: { color: "#fff", fontWeight: "700" },

  dayLabel: {
    color: "#ccc",
    marginTop: 4,
    fontSize: 12,
  },

  collectBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#49c9ff",
  },

  collectText: {
    color: "#fff",
    fontWeight: "900",
  },

  walletText: {
    marginTop: 10,
    color: "#fff",
  },
});
