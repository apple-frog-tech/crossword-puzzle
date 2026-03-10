import React, { useRef, useEffect } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet } from 'react-native';

type Props = {
  id: string;
  char: string;
  homeX: number;
  homeY: number;
  tileSize: number;
  gridLayout: { x: number; y: number; width: number; height: number };
  rows: number;
  cols: number;
  snapThreshold: number;
  onDrop: (tileId: string, r: number | null, c: number | null) => void;
  onDragStart?: (tileId: string) => void;
  isCellOccupied: (r: number, c: number) => boolean;
  isInteractive?: boolean;
};

const FALLBACK_CELL_SIZE = 60;

function DraggableTileImpl({
  id,
  char,
  homeX,
  homeY,
  tileSize,
  gridLayout,
  rows,
  cols,
  snapThreshold,
  onDrop,
  onDragStart,
  isCellOccupied,
  isInteractive = true,
}: Props) {
  const panX = useRef(new Animated.Value(homeX)).current;
  const panY = useRef(new Animated.Value(homeY)).current;
  const homeRef = useRef({ x: homeX, y: homeY });

  const lastGestureRef = useRef({ dx: 0, dy: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(panX, { toValue: homeX, useNativeDriver: true }),
      Animated.spring(panY, { toValue: homeY, useNativeDriver: true }),
    ]).start(() => {
      homeRef.current = { x: homeX, y: homeY };
      panX.setValue(homeX);
      panY.setValue(homeY);
    });
  }, [homeX, homeY]);

  useEffect(() => {
    panX.setValue(homeX);
    panY.setValue(homeY);
    homeRef.current = { x: homeX, y: homeY };
  }, [id, homeX, homeY, panX, panY]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isInteractive,
      onPanResponderGrant: () => {
        if (typeof onDragStart === 'function') onDragStart(id);
      },
      onPanResponderMove: (_, gesture) => {
        lastGestureRef.current = { dx: gesture.dx, dy: gesture.dy };
        if (rafRef.current == null) {
          rafRef.current = requestAnimationFrame(() => {
            const nx = homeRef.current.x + lastGestureRef.current.dx;
            const ny = homeRef.current.y + lastGestureRef.current.dy;
            panX.setValue(nx);
            panY.setValue(ny);
            rafRef.current = null;
          });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }

        const finalX = homeRef.current.x + gesture.dx;
        const finalY = homeRef.current.y + gesture.dy;
        const centerX = finalX + tileSize / 2;
        const centerY = finalY + tileSize / 2;

        const gridX = gridLayout?.x ?? 0;
        const gridY = gridLayout?.y ?? 0;

        const cw =
          gridLayout && gridLayout.width > 0
            ? gridLayout.width / Math.max(1, cols)
            : FALLBACK_CELL_SIZE;
        const ch =
          gridLayout && gridLayout.height > 0
            ? gridLayout.height / Math.max(1, rows)
            : FALLBACK_CELL_SIZE;

        const relX = centerX - gridX;
        const relY = centerY - gridY;

        const c = Math.floor(relX / cw);
        const r = Math.floor(relY / ch);

        if (
          (gridLayout.width <= 0 || gridLayout.height <= 0) &&
          !(c >= 0 && c < cols && r >= 0 && r < rows)
        ) {
          Animated.parallel([
            Animated.spring(panX, {
              toValue: homeRef.current.x,
              useNativeDriver: true,
            }),
            Animated.spring(panY, {
              toValue: homeRef.current.y,
              useNativeDriver: true,
            }),
          ]).start();
          onDrop(id, null, null);
          return;
        }

        if (c < 0 || c >= cols || r < 0 || r >= rows) {
          Animated.parallel([
            Animated.spring(panX, {
              toValue: homeRef.current.x,
              useNativeDriver: true,
            }),
            Animated.spring(panY, {
              toValue: homeRef.current.y,
              useNativeDriver: true,
            }),
          ]).start();
          onDrop(id, null, null);
          return;
        }

        const cellCenterX = gridX + c * cw + cw / 2;
        const cellCenterY = gridY + r * ch + ch / 2;
        const dxNorm = Math.abs(centerX - cellCenterX) / cw;
        const dyNorm = Math.abs(centerY - cellCenterY) / ch;
        if (Math.max(dxNorm, dyNorm) > snapThreshold) {
          Animated.parallel([
            Animated.spring(panX, {
              toValue: homeRef.current.x,
              useNativeDriver: true,
            }),
            Animated.spring(panY, {
              toValue: homeRef.current.y,
              useNativeDriver: true,
            }),
          ]).start();
          onDrop(id, null, null);
          return;
        }

        if (isCellOccupied(r, c)) {
          Animated.parallel([
            Animated.spring(panX, {
              toValue: homeRef.current.x,
              useNativeDriver: true,
            }),
            Animated.spring(panY, {
              toValue: homeRef.current.y,
              useNativeDriver: true,
            }),
          ]).start();
          onDrop(id, null, null);
          return;
        }

        const finalHomeX = gridX + c * cw + (cw - tileSize) / 2;
        const finalHomeY = gridY + r * ch + (ch - tileSize) / 2;

        Animated.parallel([
          Animated.spring(panX, { toValue: finalHomeX, useNativeDriver: true }),
          Animated.spring(panY, { toValue: finalHomeY, useNativeDriver: true }),
        ]).start(() => {
          homeRef.current = { x: finalHomeX, y: finalHomeY };
          panX.setValue(finalHomeX);
          panY.setValue(finalHomeY);
          onDrop(id, r, c);
        });
      },
    }),
  ).current;

  const animatedStyle = {
    position: 'absolute' as const,
    transform: [{ translateX: panX }, { translateY: panY }],
    width: tileSize,
    height: tileSize,
  };

  return (
    <Animated.View style={animatedStyle} {...responder.panHandlers}>
      <View
        style={[
          styles.tile,
          { width: tileSize, height: tileSize, borderRadius: 8 },
        ]}
      >
        <Text style={styles.tileText}>{char}</Text>
      </View>
    </Animated.View>
  );
}

function areEqual(prev: Props, next: Props) {
  return (
    prev.id === next.id &&
    prev.char === next.char &&
    prev.homeX === next.homeX &&
    prev.homeY === next.homeY &&
    prev.tileSize === next.tileSize &&
    prev.isInteractive === next.isInteractive
  );
}

export default React.memo(DraggableTileImpl, areEqual);

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E7FF',
    shadowOpacity: 0.95,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
    borderColor: 'rgba(0,235,255,0.95)',
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  tileText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
