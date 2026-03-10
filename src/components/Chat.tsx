import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutRectangle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import database from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';

export type ChatProps = {
  matchId?: string | null;
  playerId?: string | null;
  visible?: boolean;
};

type ChatMessage = {
  _id: string;
  senderId?: string | null;
  senderName?: string | null;
  text?: string | null;
  emoji?: string | null;
  ts?: number | null;
};

const COMMON_EMOJI = [
  '👍',
  '😂',
  '🎉',
  '❤️',
  '😅',
  '😮',
  '😢',
  '👏',
  '🔥',
  '🤔',
  '🙌',
  '😎',
];
const SCREEN = Dimensions.get('window');

export default function Chat({ matchId, playerId, visible = true }: ChatProps) {
  const app = getApp();
  const firebaseAuth = getAuth(app);
  const firebaseDb = getDatabase(app);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [toast, setToast] = useState<null | {
    id: string;
    text?: string;
    emoji?: string;
  }>(null);

  const FAB_SIZE = 64;
  const TOAST_MAX_WIDTH = 220;
  const TOAST_OFFSET_Y = 10;
  const PANEL_MARGIN = 8;

  const pos = useRef(
    new Animated.ValueXY({ x: SCREEN.width - 88, y: SCREEN.height - 220 }),
  ).current;
  const [fabPos, setFabPos] = useState<{ x: number; y: number }>(() => ({
    x: SCREEN.width - 88,
    y: SCREEN.height - 220,
  }));
  const fabListenerIds = useRef<{ x?: string; y?: string }>({});

  const readPosValue = () => {
    const rawX =
      (pos as any).x &&
      ((pos as any).x._value ??
        (pos as any).x.__getValue?.() ??
        SCREEN.width - 88);
    const rawY =
      (pos as any).y &&
      ((pos as any).y._value ??
        (pos as any).y.__getValue?.() ??
        SCREEN.height - 220);
    return {
      x: typeof rawX === 'number' ? rawX : SCREEN.width - 88,
      y: typeof rawY === 'number' ? rawY : SCREEN.height - 220,
    };
  };

  useEffect(() => {
    setFabPos(readPosValue());
    try {
      fabListenerIds.current.x = pos.x.addListener(({ value }) =>
        setFabPos(p => ({ x: value ?? p.x, y: p.y })),
      );
      fabListenerIds.current.y = pos.y.addListener(({ value }) =>
        setFabPos(p => ({ x: p.x, y: value ?? p.y })),
      );
    } catch (e) {}
    return () => {
      try {
        if (fabListenerIds.current.x)
          pos.x.removeListener(fabListenerIds.current.x);
      } catch (e) {}
      try {
        if (fabListenerIds.current.y)
          pos.y.removeListener(fabListenerIds.current.y);
      } catch (e) {}
    };
  }, [pos]);

  const pressStartRef = useRef<{ t: number; x: number; y: number } | null>(
    null,
  );
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, g) =>
        Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
      onPanResponderGrant: (evt, gesture) => {
        pressStartRef.current = {
          t: Date.now(),
          x: gesture.x0 ?? evt.nativeEvent.pageX,
          y: gesture.y0 ?? evt.nativeEvent.pageY,
        };
        try {
          pos.setOffset({
            x: (pos as any).x._value ?? (pos as any).x.__getValue?.() ?? 0,
            y: (pos as any).y._value ?? (pos as any).y.__getValue?.() ?? 0,
          });
        } catch (e) {
          pos.setOffset({ x: 0, y: 0 });
        }
        pos.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_evt, gesture) => {
        pos.flattenOffset();
        const start = pressStartRef.current;
        const now = Date.now();
        const dx = gesture.dx ?? 0;
        const dy = gesture.dy ?? 0;
        const dist = Math.hypot(dx, dy);
        const time = start ? now - start.t : 9999;
        if (dist < 8 && time < 250) {
          setTimeout(() => toggleOpen(), 10);
          const cur = readPosValue();
          const M = 12;
          const x = Math.max(M, Math.min(cur.x, SCREEN.width - M - FAB_SIZE));
          const y = Math.max(
            M + 40,
            Math.min(cur.y, SCREEN.height - M - FAB_SIZE),
          );
          Animated.spring(pos, {
            toValue: { x, y },
            useNativeDriver: false,
          }).start();
          pressStartRef.current = null;
          return;
        }
        let x = (pos as any).x._value ?? readPosValue().x;
        let y = (pos as any).y._value ?? readPosValue().y;
        const M = 12;
        x = Math.max(M, Math.min(x, SCREEN.width - M - FAB_SIZE));
        y = Math.max(M + 40, Math.min(y, SCREEN.height - M - FAB_SIZE));
        Animated.spring(pos, {
          toValue: { x, y },
          useNativeDriver: false,
        }).start();
        pressStartRef.current = null;
      },
      onPanResponderTerminate: () => {
        pos.flattenOffset();
        const cur = readPosValue();
        const M = 12;
        const x = Math.max(M, Math.min(cur.x, SCREEN.width - M - FAB_SIZE));
        const y = Math.max(
          M + 40,
          Math.min(cur.y, SCREEN.height - M - FAB_SIZE),
        );
        Animated.spring(pos, {
          toValue: { x, y },
          useNativeDriver: false,
        }).start();
        pressStartRef.current = null;
      },
    }),
  ).current;

  const listRef = useRef<FlatList<ChatMessage> | null>(null);
  const subscribedRef = useRef<any>(null);
  const currentAuthUid = firebaseAuth.currentUser?.uid ?? null;

  const [toastWidth, setToastWidth] = useState<number>(0);

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = (e: any) => {
      const h = Math.max(
        0,
        Math.min(e.endCoordinates?.height ?? 0, SCREEN.height),
      );
      setKeyboardHeight(h);
    };
    const onHide = () => setKeyboardHeight(0);
    const s1 = Keyboard.addListener(showEvent, onShow);
    const s2 = Keyboard.addListener(hideEvent, onHide);
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

// inside Chat component, replace the existing effect and sendMessage with:

useEffect(() => {
  if (!matchId) return;
  const path = `matches/${matchId}/chats`;
  // use the app-scoped instance instead of global database()
  const ref = firebaseDb.ref(path);
  subscribedRef.current = ref;

  const handler = (snap: any) => {
    try {
      const val = snap.val();
      if (!val) return;
      const msg: ChatMessage = {
        _id: snap.key,
        senderId: val.senderId ?? null,
        senderName: val.senderName ?? null,
        text: val.text ?? null,
        emoji: val.emoji ?? null,
        ts: val.timestamp ?? Date.now(),
      };

      setMessages(prev =>
        prev.some(p => p._id === msg._id) ? prev : [...prev, msg].slice(-200),
      );

      setTimeout(() => {
        if (!isOpen) {
          setUnseenCount(c => c + 1);
          setToast({
            id: msg._id,
            text: msg.text ?? undefined,
            emoji: msg.emoji ?? undefined,
          });
          setTimeout(() => setToast(null), 5000);
        }
      }, 20);
    } catch (e) {
      console.warn('[Chat] handler crashed', e);
    }
  };

  ref.on('child_added', handler, (err: any) => {
    console.warn('[Chat] child_added subscription error', err);
  });

  return () => {
    try {
      ref.off('child_added', handler);
    } catch (e) {}
    subscribedRef.current = null;
  };
}, [matchId, isOpen, firebaseDb]);

const sendMessage = async (payload: {
  text?: string | null;
  emoji?: string | null;
}) => {
  if (!matchId) {
    console.warn('[Chat] sendMessage: no matchId');
    return;
  }
  const uid = firebaseAuth.currentUser?.uid ?? playerId ?? null;
  const msgObj = {
    senderId: uid,
    text: payload.text ?? null,
    emoji: payload.emoji ?? null,
    timestamp: database.ServerValue.TIMESTAMP,
  } as any;
  try {
    const ref = firebaseDb.ref(`matches/${matchId}/chats`).push();
    console.log('[Chat] sending -> key=', ref.key, 'payload=', msgObj, 'matchId=', matchId, 'uid=', uid);
    await ref.set(msgObj, (err?: any) => {
      if (err) console.warn('[Chat] set callback error', err);
    });
    console.log('[Chat] push.set OK ->', ref.key);
  } catch (err) {
    console.warn('[Chat] Chat send failed', err);
  }
};

  useEffect(() => {
    if (isOpen) setUnseenCount(0);
  }, [isOpen]);

  useEffect(() => {
    if (!listRef.current) return;
    setTimeout(() => {
      try {
        listRef.current?.scrollToEnd?.({ animated: true });
      } catch (e) {}
    }, 60);
  }, [messages.length, isOpen]);

  // const sendMessage = async (payload: {
  //   text?: string | null;
  //   emoji?: string | null;
  // }) => {
  //   if (!matchId) {
  //     console.warn('[Chat] sendMessage: no matchId');
  //     return;
  //   }
  //   const uid = firebaseAuth.currentUser?.uid ?? playerId ?? null;
  //   const msgObj = {
  //     senderId: uid,
  //     text: payload.text ?? null,
  //     emoji: payload.emoji ?? null,
  //     timestamp: database.ServerValue.TIMESTAMP,
  //   } as any;
  //   try {
  //     const ref = database().ref(`matches/${matchId}/chats`).push();
  //     console.log(
  //       '[Chat] sending -> key=',
  //       ref.key,
  //       'payload=',
  //       msgObj,
  //       'matchId=',
  //       matchId,
  //       'uid=',
  //       uid,
  //     );
  //     await ref.set(msgObj);
  //     console.log('[Chat] push.set OK ->', ref.key);
  //   } catch (err) {
  //     console.warn('[Chat] Chat send failed', err);
  //   }
  // };

  const [panelLayout, setPanelLayout] = useState<LayoutRectangle | null>(null);
  const onPanelLayout = (e: any) => setPanelLayout(e.nativeEvent.layout);

  const toggleOpen = () => {
    setIsOpen(v => {
      const next = !v;
      if (!next) Keyboard.dismiss();
      return next;
    });
    if (!isOpen) {
      setUnseenCount(0);
      setToast(null);
    }
  };

  const fabCenterX = fabPos.x + FAB_SIZE / 2;
  const computedToastLeft = Math.max(
    8,
    Math.min(
      fabCenterX - toastWidth / 2,
      SCREEN.width - 8 - (toastWidth || TOAST_MAX_WIDTH),
    ),
  );

  const panelHeight =
    panelLayout?.height ?? Math.min(320, SCREEN.height * 0.45);
  const panelTopWhenKeyboard = Math.max(
    PANEL_MARGIN,
    SCREEN.height - keyboardHeight - panelHeight - PANEL_MARGIN,
  );
  const panelStyleWhenKeyboard =
    keyboardHeight > 0
      ? { top: panelTopWhenKeyboard }
      : { bottom: Math.max(PANEL_MARGIN, SCREEN.height - fabPos.y + 12) };

  const renderFab = (insideModal = false) => {
    const pan = insideModal ? {} : panResponder.panHandlers;
    return (
      <Animated.View
        {...(pan as any)}
        style={[styles.fab, { transform: pos.getTranslateTransform() }]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (isOpen) setIsOpen(false);
            else setIsOpen(true);
          }}
          style={styles.fabBtn}
        >
          <Text style={styles.fabIcon}>💬</Text>
          {unseenCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unseenCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      {visible && (
        <>
          {toast && !isOpen && (
            <Animated.View
              style={[
                styles.toastWrap,
                {
                  left: computedToastLeft,
                  top: Math.max(8, fabPos.y - TOAST_OFFSET_Y - 40),
                },
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsOpen(true);
                  setToast(null);
                  setUnseenCount(0);
                }}
              >
                <View
                  style={[styles.toastInner, { maxWidth: TOAST_MAX_WIDTH }]}
                  onLayout={e => setToastWidth(e.nativeEvent.layout.width)}
                >
                  {toast.emoji ? (
                    <Text style={styles.toastEmoji}>{toast.emoji}</Text>
                  ) : (
                    <Text style={styles.toastText}>{toast.text}</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          )}

          {!isOpen && renderFab(false)}

          <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
          >
            <SafeAreaView style={styles.modalWrap}>
              <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                <View style={styles.backdrop} />
              </TouchableWithoutFeedback>

              {renderFab(true)}

              <View
                onLayout={onPanelLayout}
                style={[
                  styles.panel,
                  panelStyleWhenKeyboard,
                  {
                    right: Math.max(
                      12,
                      SCREEN.width - (fabPos.x + FAB_SIZE) + 12,
                    ),
                  },
                ]}
              >
                <View style={styles.emojiRow}>
                  <FlatList
                    horizontal
                    data={COMMON_EMOJI}
                    keyExtractor={i => i}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => sendMessage({ emoji: item })}
                        style={styles.emojiCell}
                      >
                        <Text style={{ fontSize: 24 }}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                  />
                </View>

                <FlatList
                  ref={listRef}
                  data={messages}
                  keyExtractor={it => it._id}
                  style={styles.messagesList}
                  contentContainerStyle={{ padding: 8 }}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    const mine = !!(
                      item.senderId &&
                      (item.senderId === currentAuthUid ||
                        (!currentAuthUid &&
                          playerId &&
                          item.senderId === playerId))
                    );
                    return (
                      <View
                        style={[
                          styles.bubble,
                          mine ? styles.bubbleMine : styles.bubbleTheirs,
                        ]}
                      >
                        {item.emoji ? (
                          <Text style={styles.emojiLarge}>{item.emoji}</Text>
                        ) : (
                          <Text style={styles.msgText}>{item.text}</Text>
                        )}
                        <Text style={styles.metaText}>
                          {mine ? 'You' : 'Opponent'}
                        </Text>
                      </View>
                    );
                  }}
                />

                <View style={styles.inputRow}>
                  <TouchableOpacity
                    style={styles.smallEmojiBtn}
                    onPress={() => setText(t => t + '😀')}
                  >
                    <Text style={{ fontSize: 20 }}>😀</Text>
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Type a message"
                    value={text}
                    onChangeText={setText}
                    style={styles.input}
                    returnKeyType="send"
                    onSubmitEditing={() => {
                      if (!text.trim()) return;
                      sendMessage({ text: text.trim() });
                      setText('');
                    }}
                    blurOnSubmit={false}
                  />

                  <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={() => {
                      if (!text.trim()) return;
                      sendMessage({ text: text.trim() });
                      setText('');
                    }}
                  >
                    <Text style={styles.sendText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', width: 64, height: 64, zIndex: 9999 },
  fabBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6C4CF5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: { fontSize: 26, color: 'white' },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: '700' },

  modalWrap: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'transparent' },

  panel: {
    position: 'absolute',
    width: Math.min(360, SCREEN.width - 40),
    maxHeight: SCREEN.height * 0.7,
    backgroundColor: 'rgba(20,12,40,0.96)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },

  emojiRow: { height: 48, marginBottom: 8 },
  emojiCell: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messagesList: { maxHeight: SCREEN.height * 0.5, marginBottom: 8 },
  bubble: { marginVertical: 6, padding: 8, borderRadius: 10, maxWidth: '80%' },
  bubbleMine: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignSelf: 'flex-end',
  },
  bubbleTheirs: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignSelf: 'flex-start',
  },
  msgText: { color: 'white' },
  emojiLarge: { fontSize: 28 },
  metaText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  smallEmojiBtn: { padding: 8, marginRight: 6 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    color: 'white',
  },
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
  },
  sendText: { color: 'white', fontWeight: '700' },

  toastWrap: { position: 'absolute', zIndex: 9998 },
  toastInner: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: { color: 'white' },
  toastEmoji: { fontSize: 20 },
});
