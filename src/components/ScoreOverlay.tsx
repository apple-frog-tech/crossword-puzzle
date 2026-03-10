import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";

export type CellPos = { r: number; c: number };
export type BoardLayout = { x: number; y: number; width: number; height: number } | null;

export type ScoreOverlayHandle = {
  showLetterPoints: (opts: { row: number; col: number; points?: number; owner?: string; duration?: number; position?: "center" | "top-right" }) => Promise<void>;
  showWordPoints: (opts: { cells: CellPos[]; points?: number; owner?: string; duration?: number; position?: "center" | "top-right" }) => Promise<void>;
};

type Props = {
  boardLayout: BoardLayout;
  rows: number;
  cols: number;
  cellSize: number;
};

type Badge = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  borderColor: string;
  createdAt: number;
  animY: Animated.Value;
  animOpacity: Animated.Value;
  animScale: Animated.Value;
  width: number;
  height: number;
  isTopRightAnchor?: boolean;
};

const DEFAULT_DURATION = 600;

const ScoreOverlay = forwardRef<ScoreOverlayHandle, Props>(({ boardLayout, rows, cols, cellSize }, ref) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const badgesRef = useRef<Badge[]>([]);
  badgesRef.current = badges;

  useImperativeHandle(ref, () => ({
    showLetterPoints({ row, col, points = 1, owner = "You", duration = DEFAULT_DURATION, position = "top-right" }): Promise<void> {
      return new Promise<void>((resolve) => {
        const layout = boardLayout;
        const text = (points >= 0 ? `+${points}` : `${points}`);
        const isPositive = points >= 0;
        const color = isPositive ? "#1B0F2E" : "#E83D3D";
        const borderColor = isPositive ? "#00E7FF" : "rgba(232,61,61,0.95)";

        if (!layout) {
          const fallbackLeft = 24;
          const fallbackTop = 140;
          const centerX = fallbackLeft + col * cellSize + cellSize / 2;
          const centerY = fallbackTop + row * cellSize + cellSize / 2;
          enqueueBadgeForPosition(centerX, centerY, text, color, borderColor, duration, position, false, resolve);
          return;
        }

        const cellLeft = Math.round(layout.x + col * cellSize);
        const cellTop = Math.round(layout.y + row * cellSize);

        if (position === "top-right") {
          const anchorX = cellLeft + cellSize; 
          const anchorY = cellTop + 8; 
          enqueueBadgeForPosition(anchorX, anchorY, text, color, borderColor, duration, position, true, resolve);
        } else {
          const x = Math.round(layout.x + col * cellSize + cellSize / 2);
          const y = Math.round(layout.y + row * cellSize + cellSize / 2);
          enqueueBadgeForPosition(x, y, text, color, borderColor, duration, position, false, resolve);
        }
      });
    },

    showWordPoints({ cells, points = 0, owner = "You", duration = DEFAULT_DURATION, position = "center" }): Promise<void> {
      return new Promise<void>((resolve) => {
        const layout = boardLayout;
        if (!layout || !cells || cells.length === 0) {
          if (cells && cells[0]) {
            const first = cells[0];
            const fallbackLeft = 24;
            const fallbackTop = 140;
            const x = fallbackLeft + first.c * cellSize + cellSize / 2;
            const y = fallbackTop + first.r * cellSize + cellSize / 2;
            enqueueBadgeForPosition(x, y, `+${points}`, "#00E7FF", "#00E7FF", duration, position, false, resolve);
          } else {
            resolve();
          }
          return;
        }
        let sumX = 0;
        let sumY = 0;
        cells.forEach((c) => {
          sumX += layout.x + c.c * cellSize + cellSize / 2;
          sumY += layout.y + c.r * cellSize + cellSize / 2;
        });
        const x = Math.round(sumX / cells.length);
        const y = Math.round(sumY / cells.length);
        enqueueBadgeForPosition(x, y, `+${points}`, "#00E7FF", "#00E7FF", duration, position, false, resolve);
      });
    },
  }));


 function enqueueBadgeForPosition(
  x: number,
  y: number,
  text: string,
  color: string,
  borderColor: string,
  duration: number,
  position: "center" | "top-right",
  isTopRightExact = false,
  onComplete?: () => void
) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const animY = new Animated.Value(0);
  const animOpacity = new Animated.Value(0);
  const animScale = new Animated.Value(0.7);

  const smallCircle = 28;
  const bigCircle = 34;
  const badgeWidth = position === "top-right" ? smallCircle : bigCircle;
  const badgeHeight = badgeWidth;

  const b: Badge = {
    id, x, y, text, color, borderColor, createdAt: Date.now(),
    animY, animOpacity, animScale, width: badgeWidth, height: badgeHeight,
    isTopRightAnchor: !!isTopRightExact,
  };
  setBadges(prev => [...prev, b]);

  Animated.sequence([
    Animated.parallel([
      Animated.timing(animOpacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(animScale, { toValue: 1.15, duration: 200, easing: Easing.out(Easing.back(3)), useNativeDriver: true }),
        Animated.timing(animScale, { toValue: 1.0, duration: 130, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]),
    Animated.timing(animY, { toValue: -30, duration: Math.max(320, duration), easing: Easing.out(Easing.cubic), useNativeDriver: true }),
  ]).start();

  setTimeout(() => {
    Animated.timing(animOpacity, { toValue: 0, duration: 550, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => {
      setBadges(prev => prev.filter(it => it.id !== id));
      if (typeof onComplete === "function") {
        try { onComplete(); } catch(_) {}
      }
    });
  }, Math.max(200, duration));
}


  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]}>
      {badges.map((b) => {
        let left: number;
        if (b.isTopRightAnchor) {
          left = Math.round(b.x - b.width + 6); 
        } else {
          left = Math.round(b.x - b.width / 2);
        }
        const top = Math.round(b.y - b.height / 2);

        return (
          <Animated.View
            key={b.id}
            style={[
              overlayStyles.badge,
              {
                position: "absolute",
                left,
                top,
                width: b.width,
                height: b.height,
                transform: [{ translateY: b.animY }, { scale: b.animScale }],
                opacity: b.animOpacity,
                borderColor: b.borderColor,
                zIndex: 9999,
                elevation: 24,
                borderRadius: b.width / 2,
      paddingHorizontal: 0,  
              },
            ]}
          >
<Text style={[
  overlayStyles.badgeText,
  { color: b.color, fontSize: b.isTopRightAnchor ? 12 : 14 }
]}>
  {b.text}
</Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

const overlayStyles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    // paddingHorizontal: 8,
    borderWidth: 1.5,
  },
  badgeText: {
    fontWeight: "800",
    color: "#111",
    fontSize: 14,
  },
});

export default ScoreOverlay;