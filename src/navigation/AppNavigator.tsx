import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestMultiplayer from '../screens/TestMultiplayer';
import CrosswordPuzzleGame from '../screens/crossword-puzzle-game';
import ChooseTimeScreen from '../screens/ChooseTimeScreen';
import { CreateRoomScreen, RoomLobbyScreen } from '../screens/RoomsFeature';
import SpinScreen from '../screens/SpinScreen';
import DailyBonusScreen from '../screens/DailyBonusScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CongratulationsScreen from '../screens/CongratulationsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TestMultiplayer"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="TestMultiplayer" component={TestMultiplayer} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="SpinScreen" component={SpinScreen} />
        <Stack.Screen name="DailyBonusScreen" component={DailyBonusScreen} />
        <Stack.Screen name="ChooseTimeScreen" component={ChooseTimeScreen} />
        <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
        <Stack.Screen name="RoomLobby" component={RoomLobbyScreen} />
        <Stack.Screen
          name="CrosswordPuzzleGame"
          component={CrosswordPuzzleGame}
        />
        <Stack.Screen
          name="Congratulations"
          component={CongratulationsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
