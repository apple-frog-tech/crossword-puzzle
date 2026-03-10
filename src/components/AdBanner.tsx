import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, Platform, StyleSheet } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID, USE_TEST_ADS } from '../ads/adsConfig';

export default function AdBanner() {
  const [initialized, setInitialized] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    let mounted = true;
    mobileAds().initialize()
      .then(() => { if (mounted) setInitialized(true); })
      .catch((e) => {
        console.warn('AdBanner: mobileAds initialize failed', e);
        if (mounted) setInitialized(true);
      });
    return () => { mounted = false; };
  }, []);

  const unitId = USE_TEST_ADS ? TestIds.BANNER : BANNER_AD_UNIT_ID;
  const ESTIMATED_AD_HEIGHT = Platform.OS === 'ios' ? 50 : 50;

  let adSize: string = BannerAdSize.BANNER as unknown as string;
  if ((BannerAdSize as any).ANCHORED_ADAPTIVE_BANNER) {
    try {
      const maybeFn = (BannerAdSize as any).ANCHORED_ADAPTIVE_BANNER;
      adSize = typeof maybeFn === 'function' ? maybeFn(Math.floor(width)) : (BannerAdSize as any).ANCHORED_ADAPTIVE_BANNER;
    } catch {
      adSize = BannerAdSize.BANNER as unknown as string;
    }
  } else if ((BannerAdSize as any).ADAPTIVE_BANNER) {
    adSize = (BannerAdSize as any).ADAPTIVE_BANNER;
  } else {
    adSize = BannerAdSize.BANNER as unknown as string;
  }

  return (
    <View pointerEvents="box-none" style={[styles.adWrapper, { width , height: ESTIMATED_AD_HEIGHT}]}>
      <View style={[styles.center, { width }]}>
        <BannerAd
          unitId={unitId}
          size={adSize}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdLoaded={() => console.log('AdBanner: loaded')}
          onAdFailedToLoad={(err) => {
            console.warn('AdBanner failed to load:', err);
            console.warn('Banner unitId:', unitId, 'Use TestIds.BANNER for emulator/dev testing');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});