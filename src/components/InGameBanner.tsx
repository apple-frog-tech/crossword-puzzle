import React, { useEffect, useState } from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  setNotificationHandler,
  clearNotificationHandler,
} from '../utils/notificationCenter';

type BannerState = {
  id: number;
  type?: string;
  title?: string;
  message: string;
  durationMs?: number;
} | null;

let nextId = 1;

export default function InGameBanner() {
  const [banner, setBanner] = useState<BannerState>(null);
  const [anim] = useState(new Animated.Value(0));

  useEffect(() => {
    setNotificationHandler(n => {
      const id = nextId++;
      const duration = n.durationMs ?? 2500;
      setBanner({
        id,
        type: n.type ?? 'info',
        title: n.title,
        message: n.message,
        durationMs: duration,
      });

      Animated.timing(anim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 220,
      }).start();

      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          useNativeDriver: true,
          duration: 180,
        }).start(() => {
          setBanner(null);
        });
      }, duration + 120);
    });

    return () => {
      clearNotificationHandler();
    };
  }, [anim]);

  if (!banner) return null;

  const bg =
    banner.type === 'error'
      ? '#7F1D1D'
      : banner.type === 'warning'
      ? '#7F4F1D'
      : banner.type === 'success'
      ? '#1D6A3A'
      : '#1F2937';
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], backgroundColor: 'transparent' },
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.banner, { backgroundColor: bg }]}>
        <View style={{ flex: 1 }}>
          {banner.title ? (
            <Text style={styles.title}>{banner.title}</Text>
          ) : null}
          <Text style={styles.message}>{banner.message}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Animated.timing(anim, {
              toValue: 0,
              useNativeDriver: true,
              duration: 160,
            }).start(() => setBanner(null));
          }}
        >
          <Text style={styles.dismiss}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    zIndex: 9999,
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    minWidth: 120,
    maxWidth: 820,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 13,
  },
  message: {
    color: '#fff',
    fontSize: 13,
  },
  dismiss: {
    color: 'rgba(255,255,255,0.92)',
    marginLeft: 12,
    fontSize: 16,
    paddingHorizontal: 6,
  },
});
