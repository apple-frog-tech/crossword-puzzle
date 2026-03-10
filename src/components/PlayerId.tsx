import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import { ProfileContext } from '../context/ProfileContext';
import { notify } from '../utils/notificationCenter';

export default function PlayerId() {
  const app = getApp();
const firebaseAuth = getAuth(app);
const firebaseDb = getDatabase(app);

  const nav = useNavigation<any>();
  const ctx = useContext(ProfileContext);
  const profile = ctx?.profile ?? {};
  const setProfile = ctx?.setProfile;

  const shouldShowInitially =
    !profile?.name && typeof profile?.avatarId !== 'number' && !profile?.id;

  const [visible, setVisible] = useState<boolean>(shouldShowInitially);

  useEffect(() => {
    if ((profile?.name || typeof profile?.avatarId === 'number' || profile?.id) && visible) {
      setVisible(false);
    }
  }, [profile, visible]);

  const makeTempId = () => {
    const firebaseUid = firebaseAuth.currentUser?.uid;
    if (firebaseUid) return `${firebaseUid}`;
    return `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  };

  const assignTempId = async () => {
    const id = makeTempId();
    try {
      if (setProfile) {
        await setProfile({ id });
      } else {
        console.warn('[PlayerId] setProfile not available in ProfileContext');
      }

      try { Clipboard.setString(id); } catch (e) { /* ignore */ }

    //  notify({ type: 'info', message: `Temporary ID assigned — copied to clipboard` });
    } catch (e) {
      console.warn('[PlayerId] failed to assign temp id', e);
    //  notify({ type: 'error', message: 'Could not assign temporary ID' });
    } finally {
      setVisible(false);
    }
  };

  const goToSettings = () => {
    setVisible(false);
    nav.navigate('SettingsScreen' as never);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={s.backdrop}>
        <View style={s.box}>
          <Text style={s.heading}>Set up your profile</Text>
          <Text style={s.sub}>
            Add a display name and avatar so friends can recognise you. You can skip - we'll assign a temporary ID.
          </Text>

          <View style={{ height: 10 }} />

          <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={goToSettings}>
            <Text style={s.btnPrimaryText}>Set profile</Text>
          </TouchableOpacity>

          <View style={{ height: 10 }} />

          <TouchableOpacity style={[s.btn, s.btnSecondary]} onPress={assignTempId}>
            <Text style={s.btnSecondaryText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(6,8,12,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0e0f13',
    borderRadius: 14,
    padding: 18,
    borderWidth: 3,
    borderColor: '#49c9ff',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  heading: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  sub: { color: '#c9ccdb', fontSize: 13, marginBottom: 12 },

  btn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#6C4CF5' },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },

  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  btnSecondaryText: { color: '#fff', fontWeight: '800' },
});
