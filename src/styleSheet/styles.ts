import { StyleSheet } from 'react-native';

export const CELL_SIZE = 51;

const BORDER_COLOR = 'rgba(255,255,255,0.12)';
const GRID_LINE = 'rgba(255,255,255,0.10)';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    paddingBottom: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  //  paddingVertical: 8,
    // marginBottom: 6,
  },
  backButton: { padding: 6 },
  backButtonText: { fontSize: 22, color: '#CFC9FF' },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  settingsButton: { padding: 8 },
  settingsButtonText: { fontSize: 20, color: '#E6E0FF' },

  scoreContainerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 22,
  },
 // scoreSection: { alignItems: 'center', flex: 1 },
 // scoreLabelLight: { fontSize: 13, color: '#D9E1FF' },
 // scoreValueLight: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
   // now horizontal row: name + score + small indicator
  scoreSection: { alignItems: 'center', flex: 1, flexDirection: 'row' },
  scoreLabelLight: { fontSize: 13, color: '#D9E1FF' },
  scoreValueLight: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' }, // slightly smaller so row fits
  vsTextLight: { fontSize: 16, color: '#C9D4FF', opacity: 0.95 },

  

  // Board wrapper frame
  boardFrame: {
    alignSelf: 'center',
    // padding: 3,
    // borderRadius: 16,
    marginHorizontal: 12,
    // marginTop: 2,
    // marginBottom: 20,
    overflow: 'visible',
  },

  // Board surface itself
  board: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    // borderRadius: 12,
    borderWidth: 0.8,
    // borderColor: 'rgba(255,255,255,0.06)',
    // overflow: 'hidden',
    shadowColor: '#00E7FF',
    shadowOpacity: 0.95,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
    borderColor: 'rgba(0,235,255,0.95)',
   overflow: 'visible',
  },
  row: { flexDirection: 'row' },

  // getCellStyle
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE ,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: GRID_LINE,
    borderRadius: 0,
    // backgroundColor: 'rgba(255,255,255,0.03)',
    // shadowColor: '#00E7FF',
    // shadowOpacity: 0.95,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 1,
    // borderColor: 'rgba(0,235,255,0.95)',
    
  },
  clueCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: GRID_LINE,
    // backgroundColor: 'rgba(140,180,255,0.06)',
    // shadowColor: '#00E7FF',
    // shadowOpacity: 0.95,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 1,
    // borderColor: 'rgba(0,235,255,0.95)',
  },
  letterCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: GRID_LINE,
    // backgroundColor: 'rgba(255,255,255,0.04)',
    // shadowColor: '#00E7FF',
    // shadowOpacity: 0.95,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 1,
    // borderColor: 'rgba(0,235,255,0.95)',
  },
  emptyCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: GRID_LINE,
    // backgroundColor: 'rgba(255,255,255,0.02)',
    // shadowColor: '#00E7FF',
    // shadowOpacity: 0.95,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 1,
    // borderColor: 'rgba(0,235,255,0.95)',
  },
  specialCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: GRID_LINE,
    // backgroundColor: '#FF9800',
    // shadowColor: '#00E7FF',
    // shadowOpacity: 0.95,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 1,
    // borderColor: 'rgba(0,235,255,0.95)',
  },
  iconCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: GRID_LINE,
    // backgroundColor: 'rgba(200,230,255,0.06)',
    // shadowColor: '#00E7FF',
    // shadowOpacity: 0.95,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 0 },
    // elevation: 1,
    // borderColor: 'rgba(0,235,255,0.95)',
  },

  // Text styles (new names used in component)
  cellTextDark: {
    // fontSize: 10,
    // textAlign: 'center',
    // color: '#DCE8FF',
  },
  clueTextGlow: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CCBFF',
    textAlign: 'center',
    padding: 4
  },
  letterTextGlow: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  specialText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },

  // Neon selection effect (applies to cell container)
  neonCell: {
    shadowColor: '#00E7FF',
    shadowOpacity: 0.95,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
    borderColor: 'rgba(0,235,255,0.95)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  letterDeckContainer: { 
    alignItems: 'center', 
    paddingVertical: 2 ,
    minHeight: 72,    
    justifyContent: 'center' 
  },
  letterDeck: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  letterTile: {
    backgroundColor: '#F5DEB3',
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 2,
    // borderColor: '#D2B48C',
    elevation: 16,
    
  },
  selectedLetterTile: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
    transform: [{ scale: 1.05 }],
    
  },
  letterTileText: { fontSize: 20, fontWeight: 'bold', color: '#8B4513' },

  refillButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  refillButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },

  // Action area
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  shuffleButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
   backgroundColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#00D4FF',
    shadowOpacity: 0.7,
    shadowRadius: 8,
   elevation: 1,
  },
  shuffleButtonText: { fontSize: 16, color: '#FFF' },
  passButton: {
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  hintButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#FFD54F',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 16,
  },
  hintButtonText: { fontSize: 18 },

  // Gradient button (used inside Submit)
  gradBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6A88',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  gradBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // Reset bar
  resetGrad: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#8A2BE2',
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  resetGradText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // legacy fallback to original resetButton name (if some code uses it)
  resetButton: {
    backgroundColor: '#e67e22',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },

  // completed/history (kept for compatibility)
  completedContainer: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  completedText: { fontSize: 14, color: 'white', textAlign: 'center' },

  historyContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    maxHeight: 100,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E6E6FA',
    marginBottom: 5,
  },
  historyScroll: { maxHeight: 60 },
  historyText: { fontSize: 12, color: '#DDE5FF', marginBottom: 2 },
  actionButtonsContainer: {
 height: 72,
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 6,
},
actionButtonsInner: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '92%',
  maxWidth: 420,
  paddingHorizontal: 3,
},
hintCell: {
  backgroundColor: 'rgba(255,235,59,0.12)', // soft yellow
  borderColor: 'rgba(255,235,59,0.9)',
  borderWidth: 1.0,
  shadowColor: '#FFD54F',
  shadowOpacity: 0.5,
  shadowRadius: 8,
  elevation: 16,
},

scoredCorrect: {
  borderWidth: 2,
  borderColor: '#1B0F2E', 
  // gentle glow
  shadowColor: '#00E7FF',
  shadowOpacity: 0.45,
  shadowRadius: 10,
  elevation: 18,
},

scoredWrong: {
  borderWidth: 2,
  borderColor: '#FF4E4E', // red
  shadowColor: '#FF4E4E',
  shadowOpacity: 0.45,
  shadowRadius: 10,
  elevation: 18,
},

wordHighlightBorder: {
  borderWidth: 2,
  borderColor: '#FFD84D',
  borderRadius: 4,
  // optionally shadow / glow:
  shadowColor: '#FFD84D',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
},

letterTilePlaceholder: {
  width: 48,
  height: 48,
  marginHorizontal: 6,
  borderRadius: 8,
  backgroundColor: 'transparent',
},

submitGradientBtn: {
   width: '100%',
  // alignSelf: 'center',
  // borderRadius: 10,
  // marginTop: 12,
  paddingHorizontal: 70,
    paddingVertical: 12,
    borderRadius: 22,
    // borderWidth: 1,
    // borderColor: '#00E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2A184D',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 14,
},

submitInnerBtn: {
  paddingVertical: 14,
  alignItems: 'center',
  borderRadius: 10,
},

submitText: {
  color: '#fff',
  fontWeight: '900',
  fontSize: 16,
},


});
