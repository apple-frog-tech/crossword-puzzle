// "use client"

// import { useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal } from "react-native"

// const BOARD_SIZE = 5

// const crosswordClues = {
//   across: {
//     1: { clue: "Creative skill (3)", answer: "ART", startRow: 1, startCol: 0, length: 3 },
//     2: { clue: "Celestial body (4)", answer: "STAR", startRow: 3, startCol: 1, length: 4 },
//   },
//   down: {
//     1: { clue: "Consume food (3)", answer: "EAT", startRow: 0, startCol: 2, length: 3 },
//     2: { clue: "Large body of water (3)", answer: "SEA", startRow: 1, startCol: 4, length: 3 },
//   },
// }

// const clueCells = [
//   // Across 1: ART (row 1, cols 0-2)
//   [1, 0],
//   [1, 1],
//   [1, 2],
//   // Across 2: STAR (row 3, cols 1-4)
//   [3, 1],
//   [3, 2],
//   [3, 3],
//   [3, 4],
//   // Down 1: EAT (col 2, rows 0-2)
//   [0, 2],
//   [2, 2],
//   // Down 2: SEA (col 4, rows 1-3)
//   [2, 4],
// ]

// const initialBoard = Array(BOARD_SIZE)
//   .fill(null)
//   .map(() => Array(BOARD_SIZE).fill(""))

// const letterSets = [
//   ["A", "R", "T", "E", "S"],
//   ["S", "T", "A", "R", "E"],
//   ["E", "A", "T", "S", "R"],
//   ["S", "E", "A", "R", "T"],
//   ["T", "A", "R", "S", "E"],
// ]

// const dictionary = new Set([
//   "ART",
//   "STAR",
//   "EAT",
//   "SEA",
//   "RATE",
//   "TEAR",
//   "EAST",
//   "SEAT",
//   "TAR",
//   "EAR",
//   "TEA",
//   "ARE",
//   "ERA",
//   "SAT",
//   "RAT",
//   "SET",
// ])

// export default function EnhancedGameScreen() {
//   const [board, setBoard] = useState(initialBoard)
//   const [letterDeck, setLetterDeck] = useState(letterSets[0])
//   const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null)
//   const [currentPlayer, setCurrentPlayer] = useState<"You" | "AI">("You")
//   const [scores, setScores] = useState({ You: 0, AI: 0 })
//   const [turn, setTurn] = useState(0)
//   const [showClues, setShowClues] = useState(false)
//   const [completedWords, setCompletedWords] = useState<string[]>([])
//   const [gameHistory, setGameHistory] = useState<string[]>([])

//   const isClueCell = (row: number, col: number) => clueCells.some(([r, c]) => r === row && c === col)

//   const getClueNumber = (row: number, col: number) => {
//     // Check if this cell starts a clue
//     for (const [direction, clues] of Object.entries(crosswordClues)) {
//       for (const [num, clue] of Object.entries(clues)) {
//         if (direction === "across" && clue.startRow === row && clue.startCol === col) {
//           return `${num}A`
//         }
//         if (direction === "down" && clue.startRow === row && clue.startCol === col) {
//           return `${num}D`
//         }
//       }
//     }
//     return ""
//   }

//   const placeLetter = (row: number, col: number) => {
//     if (currentPlayer === "AI") return

//     if (!isClueCell(row, col)) {
//       Alert.alert("Invalid Move", "You can only place letters on blue clue cells.")
//       return
//     }

//     if (selectedLetterIndex === null) {
//       Alert.alert("Select Letter", "Please select a letter from your deck first.")
//       return
//     }

//     if (board[row][col]) {
//       Alert.alert("Cell Occupied", "This cell already contains a letter.")
//       return
//     }

//     const newBoard = board.map((r) => [...r])
//     newBoard[row][col] = letterDeck[selectedLetterIndex]
//     setBoard(newBoard)

//     const newDeck = [...letterDeck]
//     newDeck.splice(selectedLetterIndex, 1)
//     setLetterDeck(newDeck)

//     setSelectedLetterIndex(null)

//     // Add to game history
//     setGameHistory((prev) => [...prev, `${currentPlayer} placed ${letterDeck[selectedLetterIndex]} at (${row},${col})`])
//   }

//   const validateWords = (boardState = board) => {
//     const foundWords: { word: string; direction: string; score: number }[] = []

//     // Check horizontal words
//     for (let row = 0; row < BOARD_SIZE; row++) {
//       let word = ""
//       let startCol = -1

//       for (let col = 0; col <= BOARD_SIZE; col++) {
//         const cell = col < BOARD_SIZE ? boardState[row][col] : ""

//         if (cell && isClueCell(row, col)) {
//           if (startCol === -1) startCol = col
//           word += cell
//         } else {
//           if (word.length >= 2 && dictionary.has(word)) {
//             const baseScore = word.length
//             const bonusScore = word.length >= 4 ? word.length * 2 : 0
//             foundWords.push({
//               word,
//               direction: "horizontal",
//               score: baseScore + bonusScore,
//             })
//           }
//           word = ""
//           startCol = -1
//         }
//       }
//     }

//     // Check vertical words
//     for (let col = 0; col < BOARD_SIZE; col++) {
//       let word = ""
//       let startRow = -1

//       for (let row = 0; row <= BOARD_SIZE; row++) {
//         const cell = row < BOARD_SIZE ? boardState[row][col] : ""

//         if (cell && isClueCell(row, col)) {
//           if (startRow === -1) startRow = row
//           word += cell
//         } else {
//           if (word.length >= 2 && dictionary.has(word)) {
//             const baseScore = word.length
//             const bonusScore = word.length >= 4 ? word.length * 2 : 0
//             foundWords.push({
//               word,
//               direction: "vertical",
//               score: baseScore + bonusScore,
//             })
//           }
//           word = ""
//           startRow = -1
//         }
//       }
//     }

//     return foundWords
//   }

//   const confirmTurn = () => {
//     const words = validateWords()
//     let turnScore = 0
//     const newCompletedWords: string[] = []

//     words.forEach(({ word, score }) => {
//       turnScore += score
//       if (!completedWords.includes(word)) {
//         newCompletedWords.push(word)
//       }
//     })

//     // Bonus for using all letters
//     if (letterDeck.length === 0) {
//       turnScore += 10
//       setGameHistory((prev) => [...prev, `${currentPlayer} used all letters! +10 bonus points`])
//     }

//     // Bonus for multiple words in one turn
//     if (words.length > 1) {
//       const multiWordBonus = words.length * 3
//       turnScore += multiWordBonus
//       setGameHistory((prev) => [
//         ...prev,
//         `${currentPlayer} formed ${words.length} words! +${multiWordBonus} bonus points`,
//       ])
//     }

//     const newScores = { ...scores, [currentPlayer]: scores[currentPlayer] + turnScore }
//     setScores(newScores)
//     setCompletedWords((prev) => [...prev, ...newCompletedWords])

//     if (words.length > 0) {
//       setGameHistory((prev) => [
//         ...prev,
//         `${currentPlayer} scored ${turnScore} points with: ${words.map((w) => w.word).join(", ")}`,
//       ])
//     }

//     // Switch turns
//     if (currentPlayer === "You") {
//       setTimeout(() => aiTurn(), 1500)
//     }

//     setCurrentPlayer(currentPlayer === "You" ? "AI" : "You")

//     // Give new letters for next turn
//     const nextTurn = turn + 1
//     setTurn(nextTurn)
//     setLetterDeck(letterSets[nextTurn % letterSets.length])
//   }

//   const aiTurn = () => {
//     // Enhanced AI strategy
//     const newBoard = board.map((r) => [...r])
//     const aiLetters = letterSets[(turn + 1) % letterSets.length]
//     let bestMove = null
//     let bestScore = 0

//     // Try each available position with each letter
//     for (const [row, col] of clueCells) {
//       if (!newBoard[row][col]) {
//         for (let i = 0; i < aiLetters.length; i++) {
//           const testBoard = newBoard.map((r) => [...r])
//           testBoard[row][col] = aiLetters[i]

//           const words = validateWords(testBoard)
//           const score = words.reduce((sum, w) => sum + w.score, 0)

//           if (score > bestScore) {
//             bestScore = score
//             bestMove = { row, col, letter: aiLetters[i], letterIndex: i }
//           }
//         }
//       }
//     }

//     // Make the best move or random if no scoring move
//     if (bestMove) {
//       newBoard[bestMove.row][bestMove.col] = bestMove.letter
//       setGameHistory((prev) => [
//         ...prev,
//         `AI placed ${bestMove.letter} at (${bestMove.row},${bestMove.col}) strategically`,
//       ])
//     } else {
//       // Fallback to random placement
//       const emptyCells = clueCells.filter(([r, c]) => !newBoard[r][c])
//       if (emptyCells.length > 0) {
//         const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
//         const letter = aiLetters[Math.floor(Math.random() * aiLetters.length)]
//         newBoard[row][col] = letter
//         setGameHistory((prev) => [...prev, `AI placed ${letter} at (${row},${col})`])
//       }
//     }

//     setBoard(newBoard)

//     // Calculate AI score
//     const words = validateWords(newBoard)
//     let aiScore = 0
//     words.forEach(({ score }) => {
//       aiScore += score
//     })

//     if (aiScore > 0) {
//       setScores((prev) => ({ ...prev, AI: prev.AI + aiScore }))
//       setGameHistory((prev) => [...prev, `AI scored ${aiScore} points`])
//     }

//     setCurrentPlayer("You")
//   }

//   const resetGame = () => {
//     setBoard(initialBoard)
//     setLetterDeck(letterSets[0])
//     setSelectedLetterIndex(null)
//     setCurrentPlayer("You")
//     setScores({ You: 0, AI: 0 })
//     setTurn(0)
//     setCompletedWords([])
//     setGameHistory([])
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🎯 Crossword Master</Text>

//       <View style={styles.gameInfo}>
//         <Text style={styles.turnText}>Turn: {currentPlayer}</Text>
//         <Text style={styles.scoreText}>
//           You: {scores.You} | AI: {scores.AI}
//         </Text>
//       </View>

//       <TouchableOpacity style={styles.cluesButton} onPress={() => setShowClues(true)}>
//         <Text style={styles.cluesButtonText}>📋 View Clues</Text>
//       </TouchableOpacity>

//       <View style={styles.board}>
//         {board.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.row}>
//             {row.map((cell, colIndex) => {
//               const clueNumber = getClueNumber(rowIndex, colIndex)
//               return (
//                 <TouchableOpacity
//                   key={colIndex}
//                   style={[styles.cell, isClueCell(rowIndex, colIndex) && styles.clueCell, cell && styles.filledCell]}
//                   onPress={() => placeLetter(rowIndex, colIndex)}
//                 >
//                   {clueNumber && <Text style={styles.clueNumber}>{clueNumber}</Text>}
//                   <Text style={styles.cellText}>{cell}</Text>
//                 </TouchableOpacity>
//               )
//             })}
//           </View>
//         ))}
//       </View>

//       {currentPlayer === "You" && (
//         <>
//           <View style={styles.letterDeck}>
//             <Text style={styles.deckTitle}>Your Letters:</Text>
//             <View style={styles.letters}>
//               {letterDeck.map((letter, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[styles.letter, selectedLetterIndex === index && styles.selectedLetter]}
//                   onPress={() => setSelectedLetterIndex(index)}
//                 >
//                   <Text style={styles.letterText}>{letter}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.actionButtons}>
//             <TouchableOpacity style={styles.confirmButton} onPress={confirmTurn}>
//               <Text style={styles.confirmButtonText}>✅ Confirm Turn</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
//               <Text style={styles.resetButtonText}>🔄 Reset Game</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}

//       {completedWords.length > 0 && (
//         <View style={styles.completedWords}>
//           <Text style={styles.completedTitle}>Completed Words:</Text>
//           <Text style={styles.completedList}>{completedWords.join(", ")}</Text>
//         </View>
//       )}

//       {/* Clues Modal */}
//       <Modal visible={showClues} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Crossword Clues</Text>

//             <ScrollView style={styles.cluesContainer}>
//               <Text style={styles.clueSection}>ACROSS</Text>
//               {Object.entries(crosswordClues.across).map(([num, clue]) => (
//                 <Text key={`across-${num}`} style={styles.clueText}>
//                   {num}. {clue.clue}
//                 </Text>
//               ))}

//               <Text style={styles.clueSection}>DOWN</Text>
//               {Object.entries(crosswordClues.down).map(([num, clue]) => (
//                 <Text key={`down-${num}`} style={styles.clueText}>
//                   {num}. {clue.clue}
//                 </Text>
//               ))}
//             </ScrollView>

//             <TouchableOpacity style={styles.closeButton} onPress={() => setShowClues(false)}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     backgroundColor: "#f5f5f5",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#2c3e50",
//     textAlign: "center",
//   },
//   gameInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginBottom: 15,
//     paddingHorizontal: 10,
//   },
//   turnText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#34495e",
//   },
//   scoreText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#27ae60",
//   },
//   cluesButton: {
//     backgroundColor: "#3498db",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//     marginBottom: 15,
//   },
//   cluesButtonText: {
//     color: "white",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   board: {
//     borderWidth: 3,
//     borderColor: "#2c3e50",
//     borderRadius: 10,
//     backgroundColor: "white",
//     padding: 5,
//   },
//   row: {
//     flexDirection: "row",
//   },
//   cell: {
//     width: 50,
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#bdc3c7",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ecf0f1",
//     position: "relative",
//   },
//   clueCell: {
//     backgroundColor: "#3498db",
//   },
//   filledCell: {
//     backgroundColor: "#2ecc71",
//   },
//   clueNumber: {
//     position: "absolute",
//     top: 2,
//     left: 3,
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "white",
//   },
//   cellText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "white",
//   },
//   letterDeck: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   deckTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#2c3e50",
//   },
//   letters: {
//     flexDirection: "row",
//   },
//   letter: {
//     backgroundColor: "#34495e",
//     padding: 15,
//     marginHorizontal: 5,
//     borderRadius: 10,
//     minWidth: 50,
//     alignItems: "center",
//   },
//   selectedLetter: {
//     backgroundColor: "#e74c3c",
//     transform: [{ scale: 1.1 }],
//   },
//   letterText: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     marginTop: 20,
//     gap: 15,
//   },
//   confirmButton: {
//     backgroundColor: "#27ae60",
//     paddingHorizontal: 25,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   confirmButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   resetButton: {
//     backgroundColor: "#e67e22",
//     paddingHorizontal: 25,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   resetButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   completedWords: {
//     marginTop: 15,
//     padding: 10,
//     backgroundColor: "white",
//     borderRadius: 10,
//     width: "100%",
//   },
//   completedTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2c3e50",
//     marginBottom: 5,
//   },
//   completedList: {
//     fontSize: 14,
//     color: "#7f8c8d",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     width: "90%",
//     maxHeight: "70%",
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#2c3e50",
//   },
//   cluesContainer: {
//     maxHeight: 300,
//   },
//   clueSection: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 15,
//     marginBottom: 10,
//     color: "#3498db",
//   },
//   clueText: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: "#2c3e50",
//     paddingLeft: 10,
//   },
//   closeButton: {
//     backgroundColor: "#3498db",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   closeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// })
