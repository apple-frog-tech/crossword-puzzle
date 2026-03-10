import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROFILE_KEY = 'user_profile_v1';

export type Profile = {
  id?: string;  
  name?: string;
  avatarId?: number; 
  country?: { cca2?: string; name?: string; flagEmoji?: string } | null;
};

export const ProfileContext = createContext<{
  profile: Profile;
  setProfile: (patch: Partial<Profile>) => Promise<void>;
} | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile>({ name: undefined, avatarId: undefined, country: null });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (!raw) return;
        setProfileState(JSON.parse(raw));
      } catch (e) {
        console.warn('Profile load failed', e);
      }
    })();
  }, []);

  const setProfile = async (patch: Partial<Profile>) => {
    const next = { ...profile, ...patch } as Profile;
    setProfileState(next);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Profile save failed', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
