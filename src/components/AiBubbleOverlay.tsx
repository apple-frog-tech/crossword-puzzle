import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

type Placement = { r: number; c: number; placed: string; correct: boolean };
type ResultPayload = {
  placements: Placement[];
  newGrid: any;
  newDeck: any[];
  scoreDelta: number;
  letters: string[];
};

type Layout = { x: number; y: number; width: number; height: number } | null;

type Props = {
  visible: boolean;
  resultPayload?: ResultPayload | null;
  opponentLayout?: Layout;
  boardLayout?: Layout;
  cellSize?: number;
  tileSize?: number;
  flightDuration?: number; // ms
  onFinish: (result?: ResultPayload) => void;
};

export default function AiBubbleOverlay({
  visible,
  resultPayload,
  opponentLayout,
  boardLayout,
  cellSize = 53,
  tileSize = 36,
  flightDuration = 1000,
  onFinish,
}: Props) {
  const [internalVisible, setInternalVisible] = useState<boolean>(visible);
  const [flying, setFlying] = useState<
    {
      id: string;
      char: string;
      pos: Animated.ValueXY;
      opacity: Animated.Value;
    }[]
  >([]);
  const screen = Dimensions.get('window');

  useEffect(() => {
    setInternalVisible(visible);

    let mounted = true;

    async function ensureAndStart() {
      if (!visible) {
        setFlying([]);
        return;
      }

      if (!resultPayload || !Array.isArray(resultPayload.placements)) {
        onFinish(resultPayload ?? undefined);
        setInternalVisible(false);
        return;
      }

      let waited = 0;
      const maxWait = 600;
      while (mounted && waited < maxWait && (!opponentLayout || !boardLayout)) {
        await wait(16);
        waited += 16;
      }
      await new Promise(r => requestAnimationFrame(r));
      await new Promise(r => requestAnimationFrame(r));
      await wait(40);

      if (!mounted) return;
      startSequence();
    }

    ensureAndStart();

    return () => {
      mounted = false;
    };
  }, [visible, resultPayload, opponentLayout, boardLayout]);

  async function startSequence() {
    if (
      !resultPayload ||
      !Array.isArray(resultPayload.placements) ||
      resultPayload.placements.length === 0
    ) {
      onFinish(resultPayload ?? undefined);
      setInternalVisible(false);
      return;
    }

    await new Promise(r => requestAnimationFrame(r));
    await wait(80);

    const placements = resultPayload.placements;

    for (let i = 0; i < placements.length; i++) {
      const p = placements[i];
      const ch = p.placed ?? '';

      const startCenter = computeOpponentCenter(opponentLayout, screen.width);
      const startX = startCenter.x - tileSize / 2;
      const startY = startCenter.y - tileSize / 2;

      const endCenter = computeCellCenter(boardLayout, p.r, p.c, cellSize);
      const targetX = endCenter.x - tileSize / 2;
      const targetY = endCenter.y - tileSize / 2;

      const pos = new Animated.ValueXY({ x: startX, y: startY });
      const opacity = new Animated.Value(1);
      const id = `${Date.now()}-${i}-${ch}`;

      setFlying(arr => [...arr, { id, char: ch, pos, opacity }]);

      await new Promise<void>(res => requestAnimationFrame(() => res()));
      await new Promise<void>(res => requestAnimationFrame(() => res()));

      const dx = Math.abs(startX - targetX);
      const dy = Math.abs(startY - targetY);
      const almostSame = dx <= 2 && dy <= 2;

      if (!almostSame) {
        await new Promise<void>(resolve => {
          Animated.timing(pos, {
            toValue: { x: targetX, y: targetY },
            duration: flightDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => resolve());
        });
      }

      await new Promise<void>(resolve => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start(() => resolve());
      });

      setFlying(arr => arr.filter(f => f.id !== id));

      await wait(140);
    }

    onFinish(resultPayload);

    await wait(120);
    setInternalVisible(false);
    setFlying([]);
  }

  function computeOpponentCenter(opL?: Layout, screenW = 360) {
    const defaultX = Math.round(screenW / 2);
    const defaultY = 56;
    if (!opL) return { x: defaultX, y: defaultY };
    return {
      x: Math.round(opL.x + opL.width / 2),
      y: Math.round(opL.y + opL.height / 2),
    };
  }

  function computeCellCenter(boardL?: Layout, r = 0, c = 0, cellSz = 53) {
    const fallbackLeft = 24;
    const fallbackTop = 140;
    if (!boardL) {
      return {
        x: fallbackLeft + c * cellSz + cellSz / 2,
        y: fallbackTop + r * cellSz + cellSz / 2,
      };
    }
    return {
      x: Math.round(boardL.x + c * cellSz + cellSz / 2),
      y: Math.round(boardL.y + r * cellSz + cellSz / 2),
    };
  }

  function wait(ms: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }

  if (!internalVisible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {flying.map(f => (
        <Animated.View
          key={f.id}
          style={[
            {
              position: 'absolute',
              width: tileSize,
              height: tileSize,
              transform: [{ translateX: f.pos.x }, { translateY: f.pos.y }],
              opacity: f.opacity,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <View
            style={[
              localStyles.flyingTile,
              { width: tileSize, height: tileSize },
            ]}
          >
            <Text
              style={[
                localStyles.flyingText,
                { fontSize: Math.max(14, tileSize * 0.52) },
              ]}
            >
              {f.char}
            </Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  flyingTile: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  flyingText: {
    color: '#000',
    fontWeight: '800',
  },
});
