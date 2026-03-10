import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ProfileContext } from '../context/ProfileContext';

export default function NameEditor() {
  const ctx = useContext(ProfileContext);
  if (!ctx) return null;
  const { profile, setProfile } = ctx;

  const [name, setName] = useState(profile.name ?? '');

  useEffect(() => {
    setName(profile.name ?? '');
  }, [profile.name]);

  const onSave = async () => {
    const trimmed = name.trim().slice(0, 20);
    await setProfile({ name: trimmed });
  };

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onBlur={onSave}
          placeholder="Enter your name"
          placeholderTextColor="#fff"
          style={styles.input}
          maxLength={20}
        />
      </View>
      <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  label: { color: '#DDE5FF', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    color: '#fff',
  },
  saveBtn: {
    marginLeft: 12,
    backgroundColor: '#49c9ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: '7%',
  },
  saveText: { color: '#fff', fontWeight: '800' },
});
