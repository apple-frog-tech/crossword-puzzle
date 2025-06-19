import { StyleSheet } from 'react-native';

import GameScreen from '@/src/screens/GameScreen';
import CrosswordPuzzleGame from '@/src/screens/crossword-puzzle-game';

export default function HomeScreen() {
  return (
    // <GameScreen />
    <CrosswordPuzzleGame />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
