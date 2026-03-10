import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileContext } from '../context/ProfileContext';

// static requires (Metro needs static paths)
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

const WINDOW_WIDTH = Dimensions.get('window').width;

export default function AvatarPicker({
  compact = false,
}: {
  compact?: boolean;
}) {
  const ctx = useContext(ProfileContext);
  if (!ctx) return null;
  const { profile, setProfile } = ctx;
  const [selected, setSelected] = useState<number | undefined>(
    profile.avatarId ?? undefined,
  );

  const COLUMNS = 5;
  const H_PADDING = 18;
  const GAP = 8;
  const avatarSize = useMemo(() => {
    const totalGaps = GAP * (COLUMNS - 1);
    const available = WINDOW_WIDTH - H_PADDING * 2 - totalGaps;
    return Math.floor(available / COLUMNS);
  }, []);

  const previewSize = Math.max(72, Math.min(96, Math.floor(avatarSize * 1.1)));

  const onSelect = async (idx: number) => {
    setSelected(idx);
    await setProfile({ avatarId: idx });
  };

  const onRemove = async () => {
    setSelected(undefined);
    await setProfile({ avatarId: undefined });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selected === index;

    return (
      <TouchableOpacity
        onPress={() => onSelect(index)}
        activeOpacity={0.9}
        style={[
          styles.tileOuter,
          { width: avatarSize, height: avatarSize, margin: GAP / 2 },
          isSelected && styles.tileOuterSelected,
        ]}
      >
        {/* gradient background circle */}
        <LinearGradient
          colors={
            isSelected
              ? ['#FFEAA7', '#000']
              : ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
          }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.tileBg,
            {
              width: avatarSize - 8,
              height: avatarSize - 8,
              borderRadius: (avatarSize - 8) / 2,
            },
          ]}
        >
          {/* tiny sparkle overlay */}
          <View style={styles.sparkleWrap}>
            <LinearGradient
              colors={['#ffffff88', '#ffffff00']}
              style={styles.sparkle}
            />
          </View>

          <Image
            source={item}
            style={[
              styles.avatarImage,
              {
                width: avatarSize + 22,
                height: avatarSize + 22,
                borderRadius: (avatarSize - 22) / 2,
              },
            ]}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={compact ? styles.compactRoot : styles.root}>
      {!compact && <Text style={styles.title}>Profile Picture</Text>}

      <View style={styles.previewRow}>
        <View
          style={[
            styles.previewOuter,
            {
              width: previewSize,
              height: previewSize,
              borderRadius: previewSize / 2,
            },
          ]}
        >
          <LinearGradient
            colors={
              selected !== undefined
                ? ['#FFEAD7', '#000']
                : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']
            }
            style={[
              styles.previewInner,
              {
                width: previewSize - 8,
                height: previewSize - 8,
                borderRadius: (previewSize - 8) / 2,
              },
            ]}
          >
            {typeof selected === 'number' ? (
              <Image
                source={AVATARS[selected]}
                style={{
                  width: previewSize + 35,
                  height: previewSize + 35,
                  borderRadius: (previewSize - 14) / 2,
                }}
              />
            ) : (
              <Text style={styles.previewPlaceholder}>+</Text>
            )}

            <View style={styles.previewSparkleWrap}>
              <LinearGradient
                colors={['#ffffff88', '#ffffff00']}
                style={styles.previewSparkle}
              />
            </View>
          </LinearGradient>
        </View>

        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={AVATARS}
        numColumns={COLUMNS}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.grid,
          { paddingHorizontal: H_PADDING - GAP / 2 },
        ]}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginVertical: 8 },
  compactRoot: { marginVertical: 6 },
  title: {
    color: '#DDE5FF',
    marginBottom: 10,
    fontWeight: '800',
    fontSize: 16,
  },

  previewRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  previewOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#FFD66B',
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
  previewPlaceholder: { color: '#fff', fontSize: 36, opacity: 0.6 },
  removeBtn: { marginLeft: 12 },
  removeText: { color: '#FFD54F', fontWeight: '700' },

  grid: { justifyContent: 'flex-start', alignItems: 'center' },

  tileOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'visible',
  },
  tileOuterSelected: {
    borderWidth: 2,
    borderColor: '#5AF1FF',
    shadowColor: '#5AF1FF',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  tileBg: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },

  sparkleWrap: {
    position: 'absolute',
    left: 6,
    top: 6,
    width: 18,
    height: 18,
    transform: [{ rotate: '20deg' }],
    borderRadius: 6,
    overflow: 'hidden',
    opacity: 0.9,
  },
  sparkle: { width: '100%', height: '100%' },

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
});
