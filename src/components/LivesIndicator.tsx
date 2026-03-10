import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

type Props = {
  lives: number;
  maxLives?: number;
  size?: number;
  blinkingIndex?: number | null;
  testID?: string;
};

export default function LivesIndicator({
  lives,
  maxLives = 3,
  size = 12,
  blinkingIndex = null,
  testID,
}: Props) {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (
      typeof blinkingIndex === 'number' &&
      blinkingIndex >= 0 &&
      blinkingIndex < maxLives &&
      blinkingIndex < lives
    ) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.18,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      blinkAnim.stopAnimation(() => blinkAnim.setValue(1));
    }
  }, [blinkingIndex, lives, maxLives, blinkAnim]);

  const dots = [];
  for (let i = 0; i < maxLives; i++) {
    const filled = i < lives;
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      marginHorizontal: 4,
      backgroundColor: filled
        ? 'rgba(255,60,60,0.98)'
        : 'rgba(255,255,255,0.12)',
      opacity: filled ? 1 : 0.28,
    };

    if (i === blinkingIndex && filled) {
      dots.push(
        <Animated.View
          key={i}
          style={[
            styles.dot,
            baseStyle,
            {
              opacity: blinkAnim,
              transform: [
                {
                  scale: blinkAnim.interpolate({
                    inputRange: [0.18, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
          testID={testID ? `${testID}-dot-${i}` : undefined}
        />,
      );
    } else {
      dots.push(
        <View
          key={i}
          style={[styles.dot, baseStyle]}
          testID={testID ? `${testID}-dot-${i}` : undefined}
        />,
      );
    }
  }

  return <View style={styles.row}>{dots}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dot: {},
});
