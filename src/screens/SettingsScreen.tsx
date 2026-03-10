import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileContext } from '../context/ProfileContext';
import AvatarPicker from '../components/AvatarPicker';
import NameEditor from '../components/NameEditor';
import CountryPickerField from '../components/CountryPickerField';
import { useNavigation } from '@react-navigation/native';

  const AVATARS = [
  require('../assets/avatars/Avatar1.png'),
  require('../assets/avatars/Avatar2.png'),
  require('../assets/avatars/Avatar3.png'),
  require('../assets/avatars/Avatar4.png'),
  require('../assets/avatars/Avatar5.png'),
  require('../assets/avatars/Avatar6.png'),
  require('../assets/avatars/Avatar7.png'),
  require('../assets/avatars/Avatar8.png'),
  require('../assets/avatars/Avatar9.png'),
  require('../assets/avatars/Avatar10.png'),
];

export default function SettingsScreen() {
  const ctx = useContext(ProfileContext);
  if (!ctx) return null;
  const { profile } = ctx;

const navigation = useNavigation<any>();


  const avatarSource =
  typeof profile.avatarId === 'number'
    ? AVATARS[profile.avatarId]
    : null;


  return (
    <LinearGradient colors={['#0D0620', '#2A1360']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <View style={styles.headerTop}>
                 <TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.navigate('TestMultiplayer')}
>
  <Text style={styles.backButtonText}>←</Text>
</TouchableOpacity>
                  <TouchableOpacity style={styles.settingsButton}><Text style={styles.settingsButtonText}>⚙️</Text></TouchableOpacity>
                </View>
        <View style={styles.header}>
          
          <View style={[styles.previewOuter, { width: 86, height: 86, borderRadius: 43 }]}>
  <LinearGradient
    colors={profile.avatarId !== undefined ? ['#FFEAA7', '#FFD66B'] : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
    style={[styles.previewInner, { width: 78, height: 78, borderRadius: 39 }]}
  >
    {typeof profile.avatarId === 'number' ? (
      <Image source={AVATARS[profile.avatarId]} style={{ width: '180%', height: '180%', borderRadius: 80 }} />
    ) : (
      <Text style={{ color: '#fff' }}>P</Text>
    )}
    <View style={styles.previewSparkleWrap}>
      <LinearGradient colors={['#ffffff88', '#ffffff00']} style={styles.previewSparkle} />
    </View>
  </LinearGradient>
</View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>
              {profile.name ?? 'Player'}
            </Text>
            <Text style={{ color: '#DDE5FF', marginTop: 6 }}>
              {profile.country?.name ?? ''}
            </Text>
          </View>
        </View>

        <View style={{ height: 12 }} />

        <AvatarPicker />

        <View style={{ height: 12 }} />

        <NameEditor />

        <View style={{ height: 8 }} />

        <CountryPickerField />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  previewCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  previewInner: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
   previewSparkleWrap: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 26,
    height: 26,
    transform: [{ rotate: '18deg' }],
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 0.95,
  },
  previewSparkle: { width: '100%', height: '100%' },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    // marginBottom: 6,
  },
  backButton: { padding: 6 },
  backButtonText: { fontSize: 22, color: '#CFC9FF' },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  settingsButton: { padding: 8 },
  settingsButtonText: { fontSize: 20, color: '#E6E0FF' },
});
