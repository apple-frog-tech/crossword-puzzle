// import React, { useEffect } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import AppNavigator from './src/navigation/AppNavigator';
// import mobileAds from 'react-native-google-mobile-ads';
// import { ADMOB_APP_ID } from './src/ads/adsConfig';

// export default function App() {

//   useEffect(() => {
//     mobileAds()
//       .initialize()
//       .then(adapterStatuses => {
//         console.log('AdMob initialized', adapterStatuses);
//       })
//       .catch(e => console.warn('AdMob init error', e));
//   }, []);

  
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <AppNavigator />
//     </GestureHandlerRootView>
//   );
// }

// App.tsx
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import mobileAds from 'react-native-google-mobile-ads';
import { GameProvider } from './src/context/GameContext';
import { ensureSignedInAnonymously } from './src/firebase';
import { ProfileProvider } from './src/context/ProfileContext';
import InGameBanner from './src/components/InGameBanner';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    setTimeout (() => {
      SplashScreen.hide()
    },500)
  })
  useEffect(() => {
    (async () => {
      try {
        // sign in anonymously (ensures auth is available for RTDB rules)
        await ensureSignedInAnonymously();
      } catch (e) {
        console.warn('ensureSignedInAnonymously failed', e);
      }

      try {
        const adapterStatuses = await mobileAds().initialize();
        console.log('AdMob initialized', adapterStatuses);
      } catch (e) {
        console.warn('AdMob init error', e);
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
      <GameProvider>
        <InGameBanner />
        <AppNavigator />
      </GameProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}
