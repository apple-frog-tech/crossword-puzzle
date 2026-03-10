import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View, Image, ActivityIndicator, ImageSourcePropType, ViewStyle, ImageStyle  } from "react-native";
import mobileAds, {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType
} from "react-native-google-mobile-ads";
import { REWARDED_AD_UNIT_ID, USE_TEST_ADS } from "../ads/adsConfig";
import type { GridCell, DeckItem } from "../types";

type Coord = { r: number; c: number };
type UseHintsArgs = {
  grid: GridCell[][];
  solutionGrid: string[][];
  letterDeck: DeckItem[]; 
  freeHints?: number; // default 2
  highlightDurationMs?: number; 
  persistKey?: string | null; 
};

export function useHints({
  grid,
  solutionGrid,
  letterDeck,
  freeHints = 2,
  highlightDurationMs = 5000,
  persistUntilSubmit = true,
}: UseHintsArgs & { persistUntilSubmit?: boolean } ) {
  const [usedHints, setUsedHints] = useState<number>(0);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [currentHighlights, setCurrentHighlights] = useState<Coord[]>([]);
  const clearTimerRef = useRef<number | null>(null);
  const rewardedRef = useRef<RewardedAd | null>(null);
  const adListenerRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
      if (adListenerRef.current) {
        try { adListenerRef.current(); } catch (e) { }
        adListenerRef.current = null;
      }
    };
  }, []);

  const unitId = USE_TEST_ADS ? TestIds.REWARDED : REWARDED_AD_UNIT_ID;

  const deckLettersSet = useMemo(() => {
    const s = new Set<string>();
    (letterDeck || []).forEach((d) => {
      if (d && d.char) s.add(String(d.char).toUpperCase());
    });
    return s;
  }, [letterDeck]);

  const computeHighlights = useCallback((): Coord[] => {
    const highlights: Coord[] = [];
    if (!Array.isArray(grid) || !Array.isArray(solutionGrid)) return highlights;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
        const cell = grid[r][c];
        const expected = (solutionGrid[r]?.[c] ?? "").toUpperCase();
        if (!expected) continue;
        if (!cell) continue;
        const isEmpty = cell.type === "empty" && !cell.text;
        if (!isEmpty) continue;
        if (deckLettersSet.has(expected)) {
          highlights.push({ r, c });
        }
      }
    }
    return highlights;
  }, [grid, solutionGrid, deckLettersSet]);

  const grantHintLocally = useCallback(() => {
    const h = computeHighlights();
    if (h.length === 0) {
      Alert.alert("Hint", "No matching empty cells for the letters in your deck.");
      return;
    }

    setCurrentHighlights(h);

    if (!persistUntilSubmit) {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
      const t = setTimeout(() => {
        if (isMountedRef.current) setCurrentHighlights([]);
        clearTimerRef.current = null;
      }, highlightDurationMs);
      clearTimerRef.current = t as unknown as number;
    } else {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
    }
  }, [computeHighlights, highlightDurationMs, persistUntilSubmit]);

 const loadAndShowRewarded = useCallback(async (onRewarded: () => void, onFailed?: (err: any) => void) => {
  try {
    setIsAdLoading(true);
    const rewarded = RewardedAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    rewardedRef.current = rewarded;

    const handler = (type: any, error?: any, reward?: any) => {
      if (type === RewardedAdEventType.LOADED) {
        setIsAdLoading(false);
        try {
          (rewarded as any).show?.();
          setIsAdShowing(true);
        } catch (e) {
          console.warn("useHints: rewarded.show() failed", e);
          setIsAdShowing(false);
          if (onFailed) onFailed(e);
        }
      } else if (type === RewardedAdEventType.EARNED_REWARD) {
        try {
          onRewarded();
        } catch (e) {
          console.warn("useHints: onRewarded callback error", e);
        }
      } else if (type === AdEventType.CLOSED) {
        setIsAdLoading(false);
        setIsAdShowing(false);
        if (adListenerRef.current) {
          try { adListenerRef.current(); } catch(e) {  }
          adListenerRef.current = null;
        }
      } else if (type === AdEventType.ERROR) {
        setIsAdLoading(false);
        setIsAdShowing(false);
        if (onFailed) onFailed(error);
      }
    };

    try {
      if ((rewarded as any).addAdEventListener) {
        const unsubscribe = (rewarded as any).addAdEventListener(handler);
        adListenerRef.current = typeof unsubscribe === "function" ? unsubscribe : null;
      } else if ((rewarded as any).onAdEvent) {
        const unsubscribe = (rewarded as any).onAdEvent(handler);
        adListenerRef.current = typeof unsubscribe === "function" ? unsubscribe : null;
      } else {
        adListenerRef.current = null;
        console.warn("useHints: RewardedAd does not expose addAdEventListener/onAdEvent - continuing without listener.");
      }
    } catch (e) {
      console.warn("useHints: attach listener failed", e);
      adListenerRef.current = null;
    }

    // start loading
    rewarded.load();
  } catch (err) {
    setIsAdLoading(false);
    setIsAdShowing(false);
    console.warn("useHints: loadAndShowRewarded failed:", err);
    if (onFailed) onFailed(err);
  }
}, [unitId]);


  useEffect(() => {
    if (!currentHighlights || currentHighlights.length === 0) return;

    const filtered = currentHighlights.filter(({ r, c }) => {
      const cell = grid[r]?.[c];
      if (!cell) return false;
      const stillEmpty = cell.type === "empty" && !cell.text;
      if (!stillEmpty) return false;
      const expected = (solutionGrid[r]?.[c] ?? "").toUpperCase();
      return deckLettersSet.has(expected);
    });

    if (filtered.length !== currentHighlights.length) {
      setCurrentHighlights(filtered);
    }
  }, [grid, deckLettersSet, solutionGrid, currentHighlights]);

  const requestHint = useCallback(async () => {
    if (usedHints < freeHints) {
      setUsedHints((s) => s + 1);
      grantHintLocally();
      return;
    }

    const onRewarded = () => {
      grantHintLocally();
    };
    const onFailed = (err: any) => {
      console.warn("useHints: rewarded ad failed", err);
      Alert.alert("Ad failed", "Couldn't load the ad. Please try again later.");
    };

    if (isAdLoading || isAdShowing) return;
    try {
      await mobileAds().initialize();
      loadAndShowRewarded(onRewarded, onFailed);
    } catch (err) {
      console.warn("useHints: mobileAds initialize failed", err);
      Alert.alert("Ad error", "Ad SDK failed to initialize.");
    }
  }, [usedHints, freeHints, grantHintLocally, isAdLoading, isAdShowing]);

  const resetHighlights = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    setCurrentHighlights([]);
  }, []);

  return {
    usedHints,
    freeHints,
    isAdLoading,
    isAdShowing,
    currentHighlights,
    requestHint,
    resetHighlights, 
    computeHighlights,
  };
}


export function HintButton({
  hookResult,
  iconSource,
  showLabel = false,
  style,
  iconStyle,
  labelStyle,
  badgeStyle,
  disabled = false,
}: {
  hookResult: ReturnType<typeof useHints>;
  iconSource?: ImageSourcePropType;
  showLabel?: boolean;
  style?: ViewStyle | ViewStyle[];
  iconStyle?: ImageStyle | ImageStyle[];
  labelStyle?: any;
  badgeStyle?: any;
  disabled?: boolean;
}) {
  const { usedHints, freeHints, isAdLoading, requestHint } = hookResult;

  const label =
    usedHints < freeHints
      ? `Hint (${freeHints - usedHints} free)`
      : isAdLoading
      ? "Loading…"
      : "Watch ad";

  const actuallyDisabled = Boolean(isAdLoading || disabled);

  const defaultIcon = require("../assets/hint.png"); 

  return (
    <TouchableOpacity
      onPress={() => {
        if (actuallyDisabled) return;
        requestHint();
      }}
      disabled={actuallyDisabled}
      accessibilityRole="button"
      accessibilityLabel={
        showLabel ? label : `Hint button${usedHints < freeHints ? ", free hints left: " + (freeHints - usedHints) : ""}`
      }
      accessibilityState={{ disabled: actuallyDisabled }}
      style={[
        {
        //  paddingHorizontal: 12,
         // paddingVertical: 8,
          flexDirection: "row",
          width: 53,
          height: 53,
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.04)",
          shadowColor: "#ffff00",
          shadowOpacity: 0.7,
          shadowRadius: 8,
          elevation: 1,
          position: "relative", 
        },
        style,
        actuallyDisabled && { opacity: 0.6 },
      ]}
    >
      {isAdLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Image
            source={iconSource ?? defaultIcon}
            style={[{ width: 35, height: 35, resizeMode: "contain", marginRight: showLabel ? 8 : 0 }, iconStyle]}
            accessible={false}
          />

          {showLabel && (
            <Text style={[{ fontWeight: "700", color: "#1a1a1a" }, labelStyle]} numberOfLines={1}>
              {label}
            </Text>
          )}

          {usedHints < freeHints && (
            <View
              pointerEvents="none" 
              style={[
                {
                  position: "absolute",
                  top: -6,   
                  right: -6, 
                  minWidth: 20,
                  height: 20,
                  paddingHorizontal: 4,
                  borderRadius: 10,
                  backgroundColor: "#FF3B30", 
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "white",
                },
                badgeStyle,
              ]}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{freeHints - usedHints}</Text>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
