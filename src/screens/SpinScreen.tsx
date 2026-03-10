import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, {
  G,
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { notify } from '../utils/notificationCenter';

const { width } = Dimensions.get("window");
const LOCAL_WALLET_KEY = "local_wallet_v2";

// spin rewards
const SEGMENTS = [
  5, 10, 20, 35, 50, 10, 20, 5, 50, 35, 20, 5, 35, 20, 10, 50,
];

type Wallet = {
  coins: number;
  lastSpinDate?: string; // "YYYY-MM-DD"
};

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0'); 
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


export default function SpinScreen({ navigation }: any) {
  const radius = Math.min(width, 420) * 0.38;
  const size = radius * 2 + 48;
  const cx = size / 2;
  const cy = size / 2;

  const anim = useRef(new Animated.Value(0)).current;

  const [isSpinning, setIsSpinning] = useState(false);
  const [wallet, setWallet] = useState<Wallet>({ coins: 0 });
  const [result, setResult] = useState<number | null>(null);

  const [spinAvailable, setSpinAvailable] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LOCAL_WALLET_KEY);
        if (raw) {
          const saved: Wallet = JSON.parse(raw);
          setWallet(saved);
          setSpinAvailable(saved.lastSpinDate !== today());
        } else {
          setWallet({ coins: 0 });
          setSpinAvailable(true);
        }
      } catch (e) {
        console.warn("Spin load error", e);
      }
    })();
  }, []);

  async function saveWallet(next: Wallet) {
    setWallet(next);
    await AsyncStorage.setItem(LOCAL_WALLET_KEY, JSON.stringify(next));
  }

  const segmentsPath = useMemo(() => {
    const arr: { d: string; midAngle: number; label: number }[] = [];
    const segAngle = 360 / SEGMENTS.length;

    for (let i = 0; i < SEGMENTS.length; i++) {
      const start = -90 + i * segAngle;
      const end = start + segAngle;

      const x1 = cx + radius * Math.cos((start * Math.PI) / 180);
      const y1 = cy + radius * Math.sin((start * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((end * Math.PI) / 180);
      const y2 = cy + radius * Math.sin((end * Math.PI) / 180);

      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      arr.push({ d, midAngle: start + segAngle / 2, label: SEGMENTS[i] });
    }
    return arr;
  }, [cx, cy, radius]);

  const vibrant = [
    "#FF5E7A",
    "#FFB84D",
    "#FFED59",
    "#61F2A8",
    "#5ED0FF",
    "#9B7CFF",
    "#FF7AE1",
    "#FFD08A",
  ];
  const sliceFill = (i: number) => vibrant[i % vibrant.length];


  const onSpinTap = async () => {
  if (!spinAvailable) {
    notify({ type: 'info', title: 'Come back later', message: 'You can spin again at midnight.', durationMs: 3500 });
    return;
  }

  const chosenIndex = Math.floor(Math.random() * SEGMENTS.length);
  const reward = SEGMENTS[chosenIndex];

  try {
    const next: Wallet = {
      coins: (wallet.coins ?? 0) + reward,
      lastSpinDate: today(),
    };
    setIsSpinning(true);
    setResult(null);
    setWallet(next);           
    setSpinAvailable(false);   

    await saveWallet(next);
  } catch (err) {
    console.warn('saveWallet immediate persist failed', err);
    notify({ type: 'warning', title: 'Save failed', message: 'Could not persist spin state; retry may be allowed.', durationMs: 3500 });
  }

  const segAngle = 360 / SEGMENTS.length;
  const mid = -90 + chosenIndex * segAngle + segAngle / 2;
  const targetAngle = -90 - mid;
  const extraTurns = 5 + Math.floor(Math.random() * 3); // 5..7
  const jitter = Math.random() * (segAngle * 0.5) - segAngle * 0.25;
  const finalRotation = extraTurns * 360 + targetAngle + jitter;

  anim.setValue(0);
  Animated.timing(anim, {
    toValue: finalRotation,
    duration: 4800,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start(() => {
    setIsSpinning(false);
    setResult(reward);
    notify({ type: 'success', title: 'Nice!', message: `You received ${reward} coins.`, durationMs: 3500 });
  });
};

  const rotate = anim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#1B0730", "#3A1E5B", "#6D3DC0"]}
      style={styles.outer}
    >
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Daily Spin</Text>
        <Text style={styles.sub}>Coins: {wallet.coins ?? 0}</Text>
      </View>

      <View style={styles.centerArea}>
        <View style={{ width: size, height: size }}>
          <Animated.View
            style={{ width: size, height: size, transform: [{ rotate }] }}
          >
            <Svg width={size} height={size}>
              <Defs>
                <RadialGradient id="shine" cx="50%" cy="47%" r="60%">
                  <Stop offset="0%" stopColor="#ffffff66" stopOpacity="0.24" />
                  <Stop offset="60%" stopColor="#00000000" stopOpacity="0" />
                </RadialGradient>
              </Defs>

              <Circle cx={cx} cy={cy} r={radius + 15} fill="#2b0c2b" />

              {/* slices */}
              {segmentsPath.map((s, i) => {
                const labelRadius = radius * 0.62;
                const ang = (s.midAngle * Math.PI) / 180;
                const lx = cx + Math.cos(ang) * labelRadius;
                const ly = cy + Math.sin(ang) * labelRadius;

                return (
                  <G key={i}>
                    <Path
                      d={s.d}
                      fill={sliceFill(i)}
                      stroke="#F2C971"
                      strokeWidth={0.8}
                    />
                    <SvgText
                      x={lx}
                      y={ly}
                      fontSize={14}
                      fontWeight="700"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="#23120a"
                      stroke="#ffffff88"
                      strokeWidth={0.8}
                    >
                      {String(s.label)}
                    </SvgText>
                  </G>
                );
              })}

              <Circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="url(#shine)"
                opacity={0.22}
              />
            </Svg>
          </Animated.View>

          {/* pointer */}
          <View style={styles.pointerWrap}>
            <View style={styles.pointerFrame}>
              <View style={styles.pointer} />
            </View>
          </View>

          {/* center badge */}
          <View style={styles.centerBadgeStatic}>
            <LinearGradient
              colors={["#7B3CF0", "#5A22C9"]}
              style={styles.centerInner}
            >
              <Text style={styles.centerText}>SPIN</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          disabled={isSpinning || !spinAvailable}
          onPress={onSpinTap}
          style={[
            styles.spinButton,
            (isSpinning || !spinAvailable) && { opacity: 0.45 },
          ]}
        >
          <Text style={styles.spinText}>
            {isSpinning
              ? "Spinning…"
              : !spinAvailable
              ? "COME BACK TOMORROW"
              : "SPIN"}
          </Text>
        </TouchableOpacity>

        {result !== null && (
          <Text style={styles.resultText}>You got {result} coins!</Text>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 12 }}
        >
          <Text style={{ color: "#FFF" }}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, paddingHorizontal: 12, paddingTop: 14 },
  headerWrap: { alignItems: "center", marginTop: "20%" },
  title: { fontSize: 35, fontWeight: "700", color: "#FFF" },
  sub: { color: "#E6E0FF", marginTop: 6, fontSize: 20 },
  centerArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  pointerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pointerFrame: {
    width: 64,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#2A184D",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FF4E4E",
  },
  centerBadgeStatic: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  centerInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: { color: "#FFF", fontWeight: "900", fontSize: 18 },
  controls: { alignItems: "center", paddingVertical: 18, marginBottom: "20%" },
  spinButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: "#FF6A88",
  },
  spinText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  resultText: { marginTop: 12, color: "#fff", fontSize: 20, fontWeight: "600" },
});
