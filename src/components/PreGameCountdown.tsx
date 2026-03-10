import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, StyleSheet, Animated } from "react-native";

type Props = {
  visible: boolean;
  onFinish: () => void;
  startFrom?: number; 
};

export default function PreGameCountdown({
  visible,
  onFinish,
  startFrom = 3,
}: Props) {
  const [count, setCount] = useState<number>(startFrom);
  const tickTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const finishedRef = useRef(false); 
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const countRef = useRef<number>(startFrom);

  const pulse = () => {
    scaleAnim.setValue(0.9);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (tickTimerRef.current != null) {
        clearTimeout(tickTimerRef.current as unknown as number);
        tickTimerRef.current = null;
      }
      if (finishTimerRef.current != null) {
        clearTimeout(finishTimerRef.current as unknown as number);
        finishTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (tickTimerRef.current != null) {
      clearTimeout(tickTimerRef.current as unknown as number);
      tickTimerRef.current = null;
    }
    if (finishTimerRef.current != null) {
      clearTimeout(finishTimerRef.current as unknown as number);
      finishTimerRef.current = null;
    }
    finishedRef.current = false;

    if (!visible) {
      countRef.current = startFrom;
      setCount(startFrom);
      return;
    }

    countRef.current = startFrom;
    setCount(startFrom);
    pulse();

    const runTick = () => {
      tickTimerRef.current = (setTimeout(() => {
        countRef.current = countRef.current - 1;
        const next = countRef.current;

        setCount(next);
        pulse();

        if (next <= 0) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            finishTimerRef.current = (setTimeout(() => {
              try {
                onFinishRef.current?.();
              } catch (e) { }
              if (tickTimerRef.current != null) {
                clearTimeout(tickTimerRef.current as unknown as number);
                tickTimerRef.current = null;
              }
              finishTimerRef.current = null;
            }, 350) as unknown) as number;
          }
          return;
        }

        runTick();
      }, 1000) as unknown) as number;
    };

    tickTimerRef.current = (setTimeout(() => runTick(), 60) as unknown) as number;

    return () => {
      if (tickTimerRef.current != null) {
        clearTimeout(tickTimerRef.current as unknown as number);
        tickTimerRef.current = null;
      }
      if (finishTimerRef.current != null) {
        clearTimeout(finishTimerRef.current as unknown as number);
        finishTimerRef.current = null;
      }
      finishedRef.current = false;
    };
  }, [visible, startFrom]);

  if (!visible) return null;

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={s.backdrop}>
        <View style={s.box}>
          <Text style={s.small}>Your game is about to begin</Text>

          <Animated.View style={[s.countWrap, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={s.countText}>{count > 0 ? String(count) : "Go!"}</Text>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(6,8,12,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    width: "92%",
    maxWidth: 560,
    backgroundColor: "#0e0f13",
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },
  small: { color: "#C9CCDB", fontSize: 14, marginBottom: 12, fontWeight: "700" },
  countWrap: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  countText: { color: "#fff", fontSize: 56, fontWeight: "900" },
});
