import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';

type Props = {
  value: number;
  durationMs?: number;
  style?: StyleProp<TextStyle>;
  maxSteps?: number;
};

export default function AnimatedScore({
  value,
  durationMs = 700,
  style,
  maxSteps = 120,
}: Props) {
  const [display, setDisplay] = useState<number>(value);
  const displayRef = useRef<number>(value);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    const from = displayRef.current ?? display;
    const to = value;

    if (from === to) {
      displayRef.current = to;
      setDisplay(to);
      return;
    }

    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const diff = to - from;
    const direction = diff > 0 ? 1 : -1;
    const totalSteps = Math.abs(diff);

    if (totalSteps === 0) {
      setDisplay(to);
      displayRef.current = to;
      return;
    }

    const stepsToUse = Math.min(totalSteps, Math.max(1, maxSteps));

    const stepMs = Math.max(10, Math.ceil(durationMs / stepsToUse));

    let current = from;

    intervalRef.current = setInterval(() => {
      current += direction;
      setDisplay(current);
      displayRef.current = current;

      if (current === to) {
        if (intervalRef.current != null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, stepMs) as unknown as number;

    const safetyTimeout = setTimeout(() => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplay(to);
      displayRef.current = to;
    }, Math.max(durationMs + 200, stepMs * totalSteps + 200));

    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      clearTimeout(safetyTimeout);
    };
  }, [value, durationMs, maxSteps]);

  return (
    <Text accessible accessibilityRole="text" style={[styles.base, style]}>
      {display}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  },
});
