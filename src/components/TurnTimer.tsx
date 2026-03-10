import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useGame } from '../context/GameContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  side: 'You' | 'Opponent';
  size?: number;
  strokeWidth?: number;
  onExpire?: () => void;
  onTick?: (secondsLeft: number) => void; 
  style?: ViewStyle;
};

export default function TurnTimer({
  side,
  size = 42,
  strokeWidth = 4,
  onExpire,
  onTick,
  style,
}: Props) {
  const { state: gameState } = useGame();
  const timed = !!gameState?.matchSettings?.timed;
  const turnSeconds = (gameState?.matchSettings?.turnSeconds as number) ?? 60;
  const active =
    timed && gameState?.currentPlayer === side && gameState?.mode === 'pvp';

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useRef(new Animated.Value(1)).current;
  const animRef = useRef<any>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(turnSeconds);
  const intervalRef = useRef<number | null>(null);
  const endTsRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as any);
      intervalRef.current = null;
    }
    if ((progress as any).stopAnimation) (progress as any).stopAnimation();

    if (!active) {
      progress.setValue(1);
      setSecondsLeft(turnSeconds);
      endTsRef.current = null;
      // notify parent the timer reset
      onTick && onTick(turnSeconds);
      return;
    }

    const now = Date.now();
    const endTs = now + turnSeconds * 1000;
    endTsRef.current = endTs;

    animRef.current = Animated.timing(progress, {
      toValue: 0,
      duration: turnSeconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    progress.setValue(1);
    animRef.current.start(({ finished }: { finished: boolean }) => {
      if (finished) {
        try {
          onExpire && onExpire();
        } catch (e) {  }
      }
    });

    intervalRef.current = setInterval(() => {
      const leftMs = Math.max(0, (endTsRef.current ?? Date.now()) - Date.now());
      const secs = Math.ceil(leftMs / 1000);
      setSecondsLeft(secs);
      if (onTick) onTick(secs);
      if (leftMs <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current as any);
          intervalRef.current = null;
        }
      }
    }, 200) as unknown as number;

    return () => {
      animRef.current?.stop && animRef.current.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current as any);
        intervalRef.current = null;
      }
    };
  }, [active, turnSeconds]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  if (!timed) return null;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.12)"
          fill="transparent"
        />

        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.92)"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset as any}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.labelWrap} pointerEvents="none">
        <Text style={styles.secondsText}>{active ? secondsLeft : ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsText: { color: 'white', fontWeight: '700', fontSize: 12 },
});
