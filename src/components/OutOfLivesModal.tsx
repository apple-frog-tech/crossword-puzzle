import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  visible: boolean;
  onClose?: () => void;
  onReturnToLobby?: () => void;
  message?: string;
};

export default function OutOfLivesModal({
  visible,
  onClose,
  onReturnToLobby,
  message,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Your chances are over</Text>
          <Text style={styles.subtitle}>{message ?? 'You Lose!'}</Text>

          <LinearGradient
            colors={['#6C4CF5', '#FF6A88']}
            style={styles.actionRow}
          >
            <TouchableOpacity style={styles.playAgainBtn} onPress={onClose}>
              <Text style={styles.playAgainText}>OK</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity style={styles.lobbyLink} onPress={onReturnToLobby}>
            <Text style={styles.lobbyText}>Return to Lobby</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1A0B2D',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#F3E8FF',
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
  },
  actionRow: {
    marginTop: 18,
    width: '80%',
    borderRadius: 10,
  },
  playAgainBtn: { paddingVertical: 12, alignItems: 'center' },
  playAgainText: { color: '#fff', fontWeight: '900' },
  lobbyLink: { marginTop: 12 },
  lobbyText: {
    color: 'rgba(255,255,255,0.9)',
    textDecorationLine: 'underline',
  },
});
