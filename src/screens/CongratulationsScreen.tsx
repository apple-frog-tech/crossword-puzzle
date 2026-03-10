import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteParams = {
  winner?: 'You' | 'Opponent' | string;
  score?: number;
  moves?: number;
  timeSeconds?: number;
  extra?: Record<string, any>;
};

export default function CongratulationsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams & { nextLevel?: number };

  const onShare = useCallback(async () => {
    try {
      const text = `I just won a match! Score: ${params.score ?? 0}${
        params.moves ? ` • Moves: ${params.moves}` : ''
      }`;
      await Share.share({ message: text });
    } catch (err) {}
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animContainer} pointerEvents="none">
        <LottieView
          source={require('../assets/animation/congrats.json')}
          autoPlay
          loop={false}
          style={styles.fullLottie}
          resizeMode="cover"
        />
      </View>

      <LinearGradient
        colors={['#6e3be7cc', '#ff6a88cc']}
        style={styles.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Congratulations</Text>
          <Text style={styles.subtitle}>
            {params.winner
              ? `${params.winner} wins!`
              : 'You completed the puzzle!'}
          </Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{params.score ?? 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Moves</Text>
              <Text style={styles.statValue}>{params.moves ?? '--'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>
                {params.timeSeconds ? `${params.timeSeconds}s` : '--'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                navigation.replace('TestMultiplayer', {
                  startLevel: params.nextLevel ?? undefined,
                });
              }}
            >
              <Text style={styles.primaryBtnText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostBtn} onPress={onShare}>
              <Text style={styles.ghostBtnText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.link}
            onPress={() => {
              navigation.replace('TestMultiplayer', {
                startLevel: params.nextLevel ?? undefined,
              });
            }}
          >
            <Text style={styles.linkText}>Return to Lobby</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  animContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  fullLottie: {
    ...StyleSheet.absoluteFill,
  },

  bgGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 1,
  },

  content: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },

  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 8 },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 14,
  },

  stats: {
    flexDirection: 'row',
    marginVertical: 12,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },

  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginRight: 8,
  },
  primaryBtnText: { color: '#6C4CF5', fontWeight: '900' },
  ghostBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  ghostBtnText: { color: '#fff', fontWeight: '800' },

  link: { marginTop: 14 },
  linkText: {
    color: 'rgba(255,255,255,0.95)',
    textDecorationLine: 'underline',
  },
});
