import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';

export default function ChooseTimeScreen() {
  const navigation = useNavigation<any>();
  const { dispatch: gameDispatch } = useGame();

  const startMatchAndGoBack = (timed: boolean) => {
    gameDispatch({
      type: 'SET_MATCH_SETTINGS',
      settings: { timed, turnSeconds: 60, lives: 3, quickMatch: true, level: 1 },
    });

    navigation.navigate('TestMultiplayer', { startQuickMatch: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose game mode</Text>

      <TouchableOpacity style={[styles.btn, styles.withTime]} onPress={() => startMatchAndGoBack(true)}>
        <Text style={styles.btnText}>With Time</Text>
        <Text style={styles.subText}>1 minute per turn — timer shown</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.withoutTime]} onPress={() => startMatchAndGoBack(false)}>
        <Text style={styles.btnText}>Without Time</Text>
        <Text style={styles.subText}>Play without timers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#1A0B2D' },
  title: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 24, textAlign: 'center' },
  btn: { padding: 18, borderRadius: 12, marginVertical: 10, alignItems: 'center' },
  withTime: { backgroundColor: '#3A2A6B' },
  withoutTime: { backgroundColor: '#2A3B50' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  subText: { color: '#D6D8FF', marginTop: 6, fontSize: 12 },
});