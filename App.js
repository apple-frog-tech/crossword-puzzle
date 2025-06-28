import { StyleSheet, View } from 'react-native';
import { CrosswordPuzzleGame } from './src/screens/crossword-puzzle-game';

export default function App() {
  return (
    <View style={styles.container}>
      <CrosswordPuzzleGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
