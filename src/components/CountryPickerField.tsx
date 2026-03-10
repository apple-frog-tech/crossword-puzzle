import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
  DARK_THEME,
} from 'react-native-country-picker-modal';
import { ProfileContext } from '../context/ProfileContext';

export default function CountryPickerField() {
  const ctx = useContext(ProfileContext);
  if (!ctx) return null;
  const { profile, setProfile } = ctx;

  const [visible, setVisible] = useState(false);
  const currentCode = (profile.country?.cca2 ?? 'US') as CountryCode;

  const onSelect = async (c: Country | any) => {
    if (!c) {
      setVisible(false);
      return;
    }
    const cca2 = (c.cca2 as CountryCode) ?? currentCode;
    await setProfile({
      country: {
        cca2,
        name: (c.name ?? c?.translation?.eng ?? c?.countryName) as string,
        flagEmoji: emojiFromCca2(cca2),
      },
    });
    setVisible(false);
  };

  return (
    <View style={{ marginVertical: 12 }}>
      <Text style={styles.label}>Country</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Select Country</Text>
      </TouchableOpacity>

      <CountryPicker
        visible={visible}
        countryCode={currentCode}
        withFilter
        withFlag
        withEmoji
        withCountryNameButton
        withCallingCode={false}
        withCallingCodeButton={false}
        onSelect={onSelect}
        onClose={() => setVisible(false)}
        theme={DARK_THEME}
      />
    </View>
  );
}

function emojiFromCca2(iso?: string) {
  if (!iso || iso.length !== 2) return '';
  const codePoints = [...iso.toUpperCase()].map(
    ch => 127397 + ch.charCodeAt(0),
  );
  return String.fromCodePoint(...codePoints);
}

const styles = StyleSheet.create({
  label: { color: '#DDE5FF', marginBottom: 6, fontWeight: '700' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  flag: { fontSize: 20, marginRight: 10, color: '#fff' },
  text: { color: '#fff', fontSize: 15, fontWeight: '600' },

  selectedBelow: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
