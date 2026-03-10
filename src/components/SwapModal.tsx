import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID, USE_TEST_ADS } from '../ads/adsConfig';
import { notify } from '../utils/notificationCenter';

type DeckItem = { id: string; char: string; originalIndex?: number };

type Props = {
  visible: boolean;
  onClose: () => void;
  letterDeck: DeckItem[]; 
  onSwap: (selectedIds: string[]) => void; 
  onSwapAndPass?: (selectedIds: string[]) => void; 
};

const SCREEN_W = Dimensions.get('window').width;

export default function SwapModal({
  visible,
  onClose,
  letterDeck = [],
  onSwap,
  onSwapAndPass,
}: Props) {
  const SLOT_COUNT = 5;
  const [slotSelections, setSlotSelections] = useState<(string | null)[]>(
    Array.from({ length: SLOT_COUNT }).map(() => null),
  );

  const selectedIds = useMemo(
    () => slotSelections.filter(Boolean) as string[],
    [slotSelections],
  );

  useEffect(() => {
    if (!visible) {
      setSlotSelections(Array.from({ length: SLOT_COUNT }).map(() => null));
    } else {
      setSlotSelections(Array.from({ length: SLOT_COUNT }).map(() => null));
    }
  }, [visible, letterDeck.map(d => d.id).join('|')]);

  const handleTileTap = (tileId: string, deckIndex: number) => {
    if (deckIndex < 0 || deckIndex >= SLOT_COUNT) return;
    setSlotSelections(prev => {
      const next = [...prev];
      if (next[deckIndex] === tileId) {
        next[deckIndex] = null;
        return next;
      }
      const currentlyInOther = next.findIndex(id => id === tileId);
      if (currentlyInOther !== -1) next[currentlyInOther] = null;
      next[deckIndex] = tileId;
      return next;
    });
  };

  const handleSlotTap = (slotIndex: number) => {
    setSlotSelections(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const renderSlot = (idx: number) => {
    const id = slotSelections[idx];
    const tile = id ? letterDeck.find(d => d.id === id) : null;
    return (
      <TouchableOpacity
        key={`slot-${idx}`}
        style={styles.slot}
        onPress={() => handleSlotTap(idx)}
      >
        {tile ? (
          <View style={styles.slotTile}>
            <Text style={styles.slotTileText}>{tile.char}</Text>
          </View>
        ) : (
          <Text style={styles.slotEmptyText} />
        )}
      </TouchableOpacity>
    );
  };

  const unitId = USE_TEST_ADS ? TestIds.REWARDED : REWARDED_AD_UNIT_ID;
  const [adLoading, setAdLoading] = useState(false);
  const [adShowing, setAdShowing] = useState(false);

  const performSwapKeepTurn = (finalSelected: string[]) => {
    try {
      onSwap(finalSelected);
    } catch (err) {
      console.warn('performSwapKeepTurn: onSwap failed', err);
    } finally {
      onClose();
    }
  };

  const performSwapAndPass = (finalSelected: string[]) => {
    try {
      if (typeof onSwapAndPass === 'function') {
        onSwapAndPass(finalSelected);
      } else {
        onSwap(finalSelected);
      }
    } catch (err) {
      console.warn('performSwapAndPass: failed', err);
    } finally {
      onClose();
    }
  };

  const showRewardedAdAndSwap = async () => {

    setAdLoading(true);
    let earnedReward = false;

    const rewarded = RewardedAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubs: Array<() => void> = [];

    unsubs.push(
      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        try {
          rewarded.show();
          setAdShowing(true);
        } catch (err) {
          console.warn('rewarded.show() failed', err);
        }
      }),
    );

    unsubs.push(
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('Reward earned:', reward);
        earnedReward = true;
      }),
    );

    unsubs.push(
  rewarded.addAdEventListener(AdEventType.CLOSED, () => {
    unsubs.forEach(u => u());
    setAdLoading(false);
    setAdShowing(false);

    const finalSelectedNow = slotSelections.filter(Boolean) as string[];

    if (finalSelectedNow.length === 0) {
      onClose();
      return;
    }

    const filtered = finalSelectedNow.filter(id => letterDeck.some(d => d.id === id));
    if (filtered.length === 0) {
      notify({ type: 'error', title: 'Swap error', message: 'Selected tiles are no longer available. Please reopen swap and try again.', durationMs: 4500 });
      performSwapAndPass([]);
      return;
    }

    if (earnedReward) {
      performSwapKeepTurn(filtered);
    } else {
      performSwapAndPass(filtered);
    }
  }),
);
  }

  const onConfirmSwapButton = () => {
    showRewardedAdAndSwap();
  };

  const onConfirmSwapImmediate = () => {
    const finalSelected = slotSelections.filter(Boolean) as string[];
const filtered = finalSelected.filter(id => letterDeck.some(d => d.id === id));
if (filtered.length === 0) return;
onSwap(filtered);
onClose();

  };

  const onConfirmSwapAndPassLocal = () => {
    const finalSelected = slotSelections.filter(Boolean) as string[];
    if (finalSelected.length === 0) return;
    if (typeof onSwapAndPass === 'function') onSwapAndPass(finalSelected);
    else onSwap(finalSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Swap Tiles</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select up to {SLOT_COUNT} tiles that you want to swap
          </Text>

          <View style={styles.slotsRow}>
            {Array.from({ length: SLOT_COUNT }).map((_, i) => renderSlot(i))}
          </View>

          <View style={styles.deckLabelRow}>
            <Text style={styles.deckLabel}>
              Your Deck (tap a tile to select it into its deck slot)
            </Text>
          </View>

          <View style={styles.deckRow}>
            {Array.from({ length: SLOT_COUNT }).map((_, idx) => {
              const tile = letterDeck[idx];
              return (
                <TouchableOpacity
                  key={`deck-${idx}`}
                  style={[
                    styles.deckTile,
                    slotSelections[idx] === (tile?.id ?? null) &&
                      styles.deckTileSelected,
                  ]}
                  onPress={() => tile && handleTileTap(tile.id, idx)}
                  disabled={!tile}
                >
                  <Text style={styles.deckTileText}>{tile?.char ?? ''}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSwap]}
              onPress={onConfirmSwapButton}
              disabled={selectedIds.length === 0 || adLoading}
            >
              {adLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>Loading Ad…</Text>
                </View>
              ) : (
                <Text style={styles.btnText}>Swap (Watch Ad)</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSwapPass]}
              onPress={onConfirmSwapAndPassLocal}
              disabled={selectedIds.length === 0 || adLoading}
            >
              <Text style={styles.btnText}>Swap & Pass</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 8, alignItems: 'center' }}>
            <Text style={{ color: '#CFC6EA', fontSize: 11 }}>
              Watching the ad keeps your turn. Closing without reward swaps & passes.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const SLOT_W = Math.min(54, Math.floor((SCREEN_W - 80) / 5));
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1B0F2E',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(0,235,255,0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#F3EEFF' },
  closeBtn: { position: 'absolute', right: 10, top: 2 },
  closeText: { fontSize: 20, color: '#D8CFFF' },
  subtitle: {
    textAlign: 'center',
    color: '#CFC6EA',
    marginBottom: 12,
    fontSize: 13,
  },

  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  slot: {
    width: SLOT_W,
    height: SLOT_W,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E7FF',
    shadowOpacity: 0.95,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
    borderColor: 'rgba(0,235,255,0.95)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  slotEmptyText: {
    color: '#9EA7C4',
  },
  slotTile: { alignItems: 'center' },
  slotTileText: { fontSize: 20, fontWeight: '800', color: '#fff' },

  deckLabelRow: { marginTop: 6, marginBottom: 8 },
  deckLabel: {
    fontSize: 12, color: '#CFC6EA', textAlign: 'center'
  },

  deckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  deckTile: {
    width: SLOT_W,
    height: SLOT_W,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E7FF',
    shadowOpacity: 0.95,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    borderColor: 'rgba(0,235,255,0.95)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 1
  },
  deckTileSelected: {
    borderColor: '#7EE0FF',
    backgroundColor: 'rgba(124,238,255,0.06)',
    shadowColor: '#7EE0FF',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 10,
  },
  deckTileText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FBFF'
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    minWidth: 130,
    alignItems: 'center',
  },
  btnSwap: { backgroundColor: '#3CB371' },
  btnSwapPass: { backgroundColor: '#7A4CFF' },
  btnText: { color: '#fff', fontWeight: '800' },
});
