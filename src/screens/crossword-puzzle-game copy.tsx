"use client"

import { useState, useRef } from "react"
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native"

interface GridCell {
  type: "clue" | "letter" | "empty" | "special" | "icon"
  text: string
  id: string
  placed?: boolean
  placedBy?: "You" | "Opponent"
}

interface DragState {
  isDragging: boolean
  draggedLetter: string | null
  draggedIndex: number | null
  dragPosition: { x: number; y: number }
  targetCell: { row: number; col: number } | null
}

// Define the crossword puzzle layout matching the image
const puzzleData: { grid: GridCell[][] } = {
  grid: [
    [
      { type: "clue", text: "OTHER", id: "other" },
      { type: "clue", text: "EASTERN TIME", id: "eastern" },
      { type: "clue", text: "CHEESE", id: "cheese" },
      { type: "special", text: "@", id: "at" },
      { type: "clue", text: "NOUN", id: "noun" },
      { type: "clue", text: "CHEMICAL ENGINEER", id: "chemical" },
      { type: "icon", text: "🎒", id: "bag" },
    ],
    [
      { type: "icon", text: "🛡️", id: "shield" },
      { type: "empty", text: "", id: "1-1" },
      { type: "empty", text: "", id: "1-2" },
      { type: "letter", text: "P", id: "1-3", placed: true },
      { type: "letter", text: "L", id: "1-4", placed: true },
      { type: "empty", text: "", id: "1-5" },
      { type: "letter", text: "C", id: "1-6", placed: true },
    ],
    [
      { type: "clue", text: "THING", id: "thing" },
      { type: "letter", text: "C", id: "2-1", placed: true },
      { type: "empty", text: "", id: "2-2" },
      { type: "empty", text: "", id: "2-3" },
      { type: "clue", text: "HECTARE", id: "hectare" },
      { type: "empty", text: "", id: "2-5" },
      { type: "empty", text: "", id: "2-6" },
    ],
    [
      { type: "empty", text: "", id: "3-0" },
      { type: "empty", text: "", id: "3-1" },
      { type: "empty", text: "", id: "3-2" },
      { type: "empty", text: "", id: "3-3" },
      { type: "clue", text: "TABLET AND", id: "tablet" },
      { type: "empty", text: "", id: "3-5" },
      { type: "empty", text: "", id: "3-6" },
    ],
    [
      { type: "clue", text: "FALSE", id: "false" },
      { type: "letter", text: "N", id: "4-1", placed: true },
      { type: "clue", text: "NARROW", id: "narrow" },
      { type: "empty", text: "", id: "4-3" },
      { type: "letter", text: "P", id: "4-4", placed: true },
      { type: "empty", text: "", id: "4-5" },
      { type: "empty", text: "", id: "4-6" },
    ],
    [
      { type: "empty", text: "", id: "5-0" },
      { type: "empty", text: "", id: "5-1" },
      { type: "clue", text: "START", id: "start" },
      { type: "empty", text: "", id: "5-3" },
      { type: "empty", text: "", id: "5-4" },
      { type: "clue", text: "NORTH", id: "north" },
      { type: "empty", text: "", id: "5-6" },
    ],
    [
      { type: "clue", text: "FLAP", id: "flap" },
      { type: "letter", text: "W", id: "6-1", placed: true },
      { type: "empty", text: "", id: "6-2" },
      { type: "empty", text: "", id: "6-3" },
      { type: "empty", text: "", id: "6-4" },
      { type: "clue", text: "WITHOUT", id: "without" },
      { type: "empty", text: "", id: "6-6" },
    ],
    [
      { type: "empty", text: "", id: "7-0" },
      { type: "empty", text: "", id: "7-1" },
      { type: "empty", text: "", id: "7-2" },
      { type: "empty", text: "", id: "7-3" },
      { type: "empty", text: "", id: "7-4" },
      { type: "empty", text: "", id: "7-5" },
      { type: "clue", text: "TOGETHER", id: "together" },
    ],
    [
      { type: "clue", text: "EACH", id: "each" },
      { type: "letter", text: "E", id: "8-1", placed: true },
      { type: "empty", text: "", id: "8-2" },
      { type: "clue", text: "RULE", id: "rule" },
      { type: "empty", text: "", id: "8-4" },
      { type: "empty", text: "", id: "8-5" },
      { type: "empty", text: "", id: "8-6" },
    ],
    [
      { type: "empty", text: "", id: "9-0" },
      { type: "empty", text: "", id: "9-1" },
      { type: "empty", text: "", id: "9-2" },
      { type: "clue", text: "NANOS ECOND", id: "nano" },
      { type: "clue", text: "PULLA CAR", id: "pulla" },
      { type: "letter", text: "T", id: "9-5", placed: true },
      { type: "empty", text: "", id: "9-6" },
    ],
    [
      { type: "icon", text: "🏃", id: "runner" },
      { type: "empty", text: "", id: "10-1" },
      { type: "empty", text: "", id: "10-2" },
      { type: "empty", text: "", id: "10-3" },
      { type: "clue", text: "ALIENS", id: "aliens" },
      { type: "empty", text: "", id: "10-5" },
      { type: "empty", text: "", id: "10-6" },
    ],
    [
      { type: "clue", text: "RESULT", id: "result" },
      { type: "letter", text: "E", id: "11-1", placed: true },
      { type: "letter", text: "N", id: "11-2", placed: true },
      { type: "empty", text: "", id: "11-3" },
      { type: "letter", text: "U", id: "11-4", placed: true },
      { type: "clue", text: "ISLE", id: "isle" },
      { type: "empty", text: "", id: "11-6" },
    ],
    [
      { type: "empty", text: "", id: "12-0" },
      { type: "empty", text: "", id: "12-1" },
      { type: "empty", text: "", id: "12-2" },
      { type: "empty", text: "", id: "12-3" },
      { type: "empty", text: "", id: "12-4" },
      { type: "clue", text: "COAST GUARD", id: "coast" },
      { type: "empty", text: "", id: "12-6" },
    ],
    [
      { type: "clue", text: "NORTH CAROLINA", id: "carolina" },
      { type: "letter", text: "B", id: "13-1", placed: true },
      { type: "empty", text: "", id: "13-2" },
      { type: "clue", text: "REALITY", id: "reality" },
      { type: "empty", text: "", id: "13-4" },
      { type: "empty", text: "", id: "13-5" },
      { type: "letter", text: "T", id: "13-6", placed: true },
    ],
    [
      { type: "empty", text: "", id: "14-0" },
      { type: "empty", text: "", id: "14-1" },
      { type: "empty", text: "", id: "14-2" },
      { type: "clue", text: "RADIUS", id: "radius" },
      { type: "empty", text: "", id: "14-4" },
      { type: "empty", text: "", id: "14-5" },
      { type: "empty", text: "", id: "14-6" },
    ],
    [
      { type: "clue", text: "VIA", id: "via" },
      { type: "letter", text: "E", id: "15-1", placed: true },
      { type: "letter", text: "H", id: "15-2", placed: true },
      { type: "empty", text: "", id: "15-3" },
      { type: "letter", text: "U", id: "15-4", placed: true },
      { type: "empty", text: "", id: "15-5" },
      { type: "letter", text: "H", id: "15-6", placed: true },
    ],
  ],
}

// Define the correct answers for each position
const solutionGrid: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "A", "P", "P", "L", "E", "C"],
  ["", "C", "H", "E", "", "E", ""],
  ["", "K", "E", "E", "", "R", ""],
  ["", "N", "", "T", "P", "", ""],
  ["", "O", "", "", "", "", ""],
  ["", "W", "", "", "", "", ""],
  ["", "L", "", "", "", "", ""],
  ["", "E", "A", "", "", "", ""],
  ["", "D", "", "", "", "T", ""],
  ["", "G", "", "", "", "", ""],
  ["", "E", "N", "T", "U", "", ""],
  ["", "A", "", "", "", "", ""],
  ["", "B", "H", "", "", "", "T"],
  ["", "L", "", "", "", "", ""],
  ["", "E", "H", "U", "U", "", "H"],
]

// Define word patterns - only for COMPLETE rows and columns
const wordPatterns = {
  completeRows: [
    { row: 1, word: "ABASE", name: "Row 1 Complete" },
    { row: 11, word: "ENTU", name: "Row 11 Complete" },
    { row: 15, word: "THUUH", name: "Row 15 Complete" },
  ],
  completeColumns: [
    { col: 1, word: "ACKNOWLEDGEABLE", name: "Column 1 Complete" },
    { col: 2, word: "THEANHH", name: "Column 2 Complete" },
    { col: 3, word: "FEETHHU", name: "Column 3 Complete" },
  ],
}

const checkCompletedWords = (
  gridState: GridCell[][],
  completedWords: string[],
  setCompletedWords: any,
  setScores: any,
  setGameHistory: any,
) => {
  const newlyCompleted: string[] = []

  // Check complete ROWS
  wordPatterns.completeRows.forEach(({ row, word, name }) => {
    let isComplete = true
    let currentWord = ""
    let letterCount = 0

    for (let col = 0; col < gridState[row].length; col++) {
      const expectedLetter = solutionGrid[row][col]
      if (expectedLetter) {
        const cell = gridState[row][col]
        if (!cell.text || cell.text.toUpperCase() !== expectedLetter.toUpperCase()) {
          isComplete = false
          break
        }
        currentWord += cell.text.toUpperCase()
        letterCount++
      }
    }

    const wordId = `complete-row-${row}`
    if (isComplete && letterCount > 0 && !completedWords.includes(wordId)) {
      newlyCompleted.push(wordId)
      setScores((prev: { You: number }) => ({ ...prev, You: prev.You + letterCount }))
      setGameHistory((prev: any) => [
        ...prev,
        `🎉 Complete Row ${row} finished! +${letterCount} bonus points for: ${currentWord}`,
      ])
    }
  })

  // Check complete COLUMNS
  wordPatterns.completeColumns.forEach(({ col, word, name }) => {
    let isComplete = true
    let currentWord = ""
    let letterCount = 0

    for (let row = 0; row < gridState.length; row++) {
      const expectedLetter = solutionGrid[row][col]
      if (expectedLetter) {
        const cell = gridState[row][col]
        if (!cell.text || cell.text.toUpperCase() !== expectedLetter.toUpperCase()) {
          isComplete = false
          break
        }
        currentWord += cell.text.toUpperCase()
        letterCount++
      }
    }

    const wordId = `complete-column-${col}`
    if (isComplete && letterCount > 0 && !completedWords.includes(wordId)) {
      newlyCompleted.push(wordId)
      setScores((prev: { You: number }) => ({ ...prev, You: prev.You + letterCount }))
      setGameHistory((prev: any) => [
        ...prev,
        `🎉 Complete Column ${col} finished! +${letterCount} bonus points for: ${currentWord}`,
      ])
    }
  })

  if (newlyCompleted.length > 0) {
    setCompletedWords((prev: any) => [...prev, ...newlyCompleted])
  }
}

const allAvailableLetters = ["A", "T", "L", "F", "E", "H", "C", "I", "P", "A", "N", "U", "K", "D"]
const initialLetters = ["L", "H", "A", "O", "E"]

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

export default function CrosswordPuzzleGameWithDragDropFixed() {
  const [grid, setGrid] = useState<GridCell[][]>(puzzleData.grid)
  const [letterDeck, setLetterDeck] = useState(initialLetters)
  const [currentPlayer, setCurrentPlayer] = useState<"You" | "Opponent">("You")
  const [scores, setScores] = useState({ You: 0, Opponent: 7 })
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [completedWords, setCompletedWords] = useState<string[]>([])

  // Drag and Drop State
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedLetter: null,
    draggedIndex: null,
    dragPosition: { x: 0, y: 0 },
    targetCell: null,
  })

  // Animated values for drag feedback
  const draggedLetterOpacity = useRef(new Animated.Value(1)).current
  const draggedLetterScale = useRef(new Animated.Value(1)).current

  // Refs to store cell positions for drop detection
  const cellRefs = useRef<{ [key: string]: { x: number; y: number; width: number; height: number } }>({})
  const boardRef = useRef<View>(null)

  const isEmptyCell = (cell: GridCell) => cell.type === "empty" && !cell.text

  const getNeededLetters = () => {
    const neededLetters: string[] = []
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (isEmptyCell(cell)) {
          const expectedLetter = solutionGrid[rowIndex][colIndex]
          if (expectedLetter && !neededLetters.includes(expectedLetter)) {
            neededLetters.push(expectedLetter)
          }
        }
      })
    })
    return neededLetters
  }

  const refillLetterDeck = () => {
    if (letterDeck.length === 0) {
      const neededLetters = getNeededLetters()
      if (neededLetters.length > 0) {
        const newDeck: string[] = []
        for (let i = 0; i < 5; i++) {
          const randomLetter = neededLetters[Math.floor(Math.random() * neededLetters.length)]
          newDeck.push(randomLetter)
        }
        setLetterDeck(newDeck)
        setGameHistory((prev) => [...prev, `🔄 New letters provided: ${newDeck.join(", ")}`])
      } else {
        const newDeck: string[] = []
        for (let i = 0; i < 5; i++) {
          const randomLetter = allAvailableLetters[Math.floor(Math.random() * allAvailableLetters.length)]
          newDeck.push(randomLetter)
        }
        setLetterDeck(newDeck)
        setGameHistory((prev) => [...prev, `🔄 Random letters provided: ${newDeck.join(", ")}`])
      }
    }
  }

  // Function to detect which cell is under the drag position
  const getCellUnderPosition = (x: number, y: number) => {
    for (const [key, position] of Object.entries(cellRefs.current)) {
      if (x >= position.x && x <= position.x + position.width && y >= position.y && y <= position.y + position.height) {
        const [row, col] = key.split("-").map(Number)
        return { row, col }
      }
    }
    return null
  }

  // Create PanResponder for drag and drop
  const createLetterPanResponder = (letterIndex: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        if (currentPlayer !== "You") return

        const letter = letterDeck[letterIndex]
        setDragState({
          isDragging: true,
          draggedLetter: letter,
          draggedIndex: letterIndex,
          dragPosition: { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY },
          targetCell: null,
        })

        // Animate the dragged letter
        Animated.parallel([
          Animated.timing(draggedLetterOpacity, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(draggedLetterScale, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start()
      },

      onPanResponderMove: (evt) => {
        if (!dragState.isDragging) return

        const newPosition = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY }
        const targetCell = getCellUnderPosition(newPosition.x, newPosition.y)

        setDragState((prev) => ({
          ...prev,
          dragPosition: newPosition,
          targetCell,
        }))
      },

      onPanResponderRelease: (evt) => {
        if (!dragState.isDragging) return

        const dropPosition = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY }
        const targetCell = getCellUnderPosition(dropPosition.x, dropPosition.y)

        // Reset animations
        Animated.parallel([
          Animated.timing(draggedLetterOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(draggedLetterScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start()

        if (targetCell && dragState.draggedLetter && dragState.draggedIndex !== null) {
          // Attempt to place the letter
          placeLetter(targetCell.row, targetCell.col, dragState.draggedIndex, dragState.draggedLetter)
        }

        // Reset drag state
        setDragState({
          isDragging: false,
          draggedLetter: null,
          draggedIndex: null,
          dragPosition: { x: 0, y: 0 },
          targetCell: null,
        })
      },
    })
  }

  const placeLetter = (rowIndex: number, colIndex: number, letterIndex: number, letter: string) => {
    if (currentPlayer === "Opponent") return

    const cell = grid[rowIndex][colIndex]

    if (!isEmptyCell(cell)) {
      Alert.alert("Invalid Move", "You can only place letters on empty cells.")
      return
    }

    const correctLetter = solutionGrid[rowIndex][colIndex]
    let isCorrect = false

    if (correctLetter && letter.toUpperCase() === correctLetter.toUpperCase()) {
      isCorrect = true
      setScores((prev) => ({ ...prev, You: prev.You + 1 }))
      setGameHistory((prev) => [...prev, `✅ Correct! +1 point for placing ${letter} at (${rowIndex},${colIndex})`])

      const newGrid = grid.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return {
              ...cell,
              text: letter,
              type: "letter" as const,
              placed: true,
              placedBy: currentPlayer,
            } as GridCell
          }
          return cell
        }),
      )
      setGrid(newGrid)

      setTimeout(() => {
        checkCompletedWords(newGrid, completedWords, setCompletedWords, setScores, setGameHistory)
      }, 100)
    } else {
      setScores((prev) => ({ ...prev, You: Math.max(0, prev.You - 1) }))
      setGameHistory((prev) => [...prev, `❌ Wrong! -1 point. Expected: ${correctLetter || "None"}, Got: ${letter}`])
    }

    // Remove the letter from deck
    const newDeck = [...letterDeck]
    newDeck.splice(letterIndex, 1)
    setLetterDeck(newDeck)

    setTimeout(() => {
      refillLetterDeck()
    }, 500)
  }

  const passTurn = () => {
    setGameHistory((prev) => [...prev, `${currentPlayer} passed their turn`])

    if (currentPlayer === "You") {
      setTimeout(() => aiTurn(), 1000)
    }

    setCurrentPlayer(currentPlayer === "You" ? "Opponent" : "You")

    if (letterDeck.length === 0) {
      refillLetterDeck()
    }
  }

  const aiTurn = () => {
    const emptyCells: [number, number][] = []

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (isEmptyCell(cell)) {
          emptyCells.push([rowIndex, colIndex])
        }
      })
    })

    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const aiLetters = ["T", "H", "E", "A", "R"]
      const letter = aiLetters[Math.floor(Math.random() * aiLetters.length)]

      const correctLetter = solutionGrid[row][col]
      if (correctLetter && letter.toUpperCase() === correctLetter.toUpperCase()) {
        setScores((prev) => ({ ...prev, Opponent: prev.Opponent + 1 }))
        setGameHistory((prev) => [...prev, `AI got +1 point for placing ${letter} correctly`])
      }

      const newGrid = grid.map((gridRow, rIdx) =>
        gridRow.map((cell, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {
              ...cell,
              text: letter,
              type: "letter" as const,
              placed: true,
              placedBy: "Opponent",
            } as GridCell
          }
          return cell
        }),
      )

      setGrid(newGrid)
    }

    setCurrentPlayer("You")
  }

  const resetGame = () => {
    setGrid(puzzleData.grid)
    setLetterDeck(initialLetters)
    setCurrentPlayer("You")
    setScores({ You: 0, Opponent: 0 })
    setGameHistory([])
    setCompletedWords([])
    setDragState({
      isDragging: false,
      draggedLetter: null,
      draggedIndex: null,
      dragPosition: { x: 0, y: 0 },
      targetCell: null,
    })
  }

  const getCellStyle = (cell: GridCell, rowIndex: number, colIndex: number) => {
    const baseStyle = [styles.cell]

    // Highlight target cell during drag
    const isTargetCell = dragState.targetCell?.row === rowIndex && dragState.targetCell?.col === colIndex
    const canDrop = isEmptyCell(cell) && dragState.isDragging

    switch (cell.type) {
      case "clue":
        return [...baseStyle, styles.clueCell]
      case "letter":
        return [...baseStyle, styles.letterCell]
      case "empty":
        return [...baseStyle, styles.emptyCell, isTargetCell && canDrop && styles.targetCell]
      case "special":
        return [...baseStyle, styles.specialCell]
      case "icon":
        return [...baseStyle, styles.iconCell]
      default:
        return [...baseStyle, styles.emptyCell, isTargetCell && canDrop && styles.targetCell]
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Puzzle 2</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>You</Text>
          <Text style={styles.scoreValue}>{scores.You}</Text>
        </View>
        <Text style={styles.vsText}>vs</Text>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Opponent</Text>
          <Text style={styles.scoreValue}>{scores.Opponent}</Text>
        </View>
      </View>

      {/* Game Board */}
      <ScrollView style={styles.boardContainer} showsVerticalScrollIndicator={false}>
        <View
          ref={boardRef}
          style={styles.board}
          onLayout={(event) => {
            // Store board position for accurate drop detection
            boardRef.current?.measureInWindow((x, y, width, height) => {
              // This gives us the board's position relative to the screen
            })
          }}
        >
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={getCellStyle(cell, rowIndex, colIndex)}
                  onLayout={(event) => {
                    // Measure cell position relative to the window (screen)
                    event.target.measureInWindow((x, y, width, height) => {
                      cellRefs.current[`${rowIndex}-${colIndex}`] = { x, y, width, height }
                    })
                  }}
                >
                  <Text
                    style={[
                      styles.cellText,
                      cell.type === "clue" && styles.clueText,
                      cell.type === "letter" && styles.letterText,
                      cell.type === "special" && styles.specialText,
                    ]}
                  >
                    {cell.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Letter Deck with Drag and Drop */}
      {currentPlayer === "You" && (
        <View style={styles.letterDeckContainer}>
          <Text style={styles.deckTitle}>🎯 Drag letters to the board:</Text>
          <View style={styles.letterDeck}>
            {letterDeck.map((letter, index) => {
              const panResponder = createLetterPanResponder(index)
              const isDraggedLetter = dragState.draggedIndex === index && dragState.isDragging

              return (
                <Animated.View
                  key={index}
                  {...panResponder.panHandlers}
                  style={[
                    styles.letterTile,
                    isDraggedLetter && {
                      opacity: draggedLetterOpacity,
                      transform: [{ scale: draggedLetterScale }],
                    },
                  ]}
                >
                  <Text style={styles.letterTileText}>{letter}</Text>
                </Animated.View>
              )
            })}
          </View>
          {letterDeck.length === 0 && (
            <TouchableOpacity style={styles.refillButton} onPress={refillLetterDeck}>
              <Text style={styles.refillButtonText}>🔄 Get New Letters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Floating Dragged Letter */}
      {dragState.isDragging && dragState.draggedLetter && (
        <View
          style={[
            styles.floatingLetter,
            {
              left: dragState.dragPosition.x - 25,
              top: dragState.dragPosition.y - 25,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.floatingLetterText}>{dragState.draggedLetter}</Text>
        </View>
      )}

      {/* Action Buttons */}
      {currentPlayer === "You" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shuffleButton}>
            <Text style={styles.shuffleButtonText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.passButton} onPress={passTurn}>
            <Text style={styles.passButtonText}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hintButton}>
            <Text style={styles.hintButtonText}>💡</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Debug Info - Remove this in production */}
      {dragState.isDragging && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Drag: ({Math.round(dragState.dragPosition.x)}, {Math.round(dragState.dragPosition.y)})
          </Text>
          <Text style={styles.debugText}>
            Target: {dragState.targetCell ? `(${dragState.targetCell.row}, ${dragState.targetCell.col})` : "None"}
          </Text>
        </View>
      )}

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>🔄 Reset Game</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#007AFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  settingsButton: {
    padding: 10,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  scoreSection: {
    alignItems: "center",
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  vsText: {
    fontSize: 20,
    color: "#999",
    marginHorizontal: 2,
  },
  boardContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  board: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 45,
    height: 45,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  clueCell: {
    width: 45,
    height: 45,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    backgroundColor: "#E3F2FD",
    padding: 2,
  },
  letterCell: {
    width: 45,
    height: 45,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyCell: {
    width: 45,
    height: 45,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  targetCell: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  specialCell: {
    width: 45,
    height: 45,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#FF9800",
  },
  iconCell: {
    width: 45,
    height: 45,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    backgroundColor: "#E3F2FD",
  },
  cellText: {
    fontSize: 10,
    textAlign: "center",
    color: "#333",
  },
  clueText: {
    fontSize: 8,
    fontWeight: "500",
    color: "#1976D2",
  },
  letterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  specialText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  letterDeckContainer: {
    alignItems: "center",
    paddingVertical: 5,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  letterDeck: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  letterTile: {
    backgroundColor: "#F5DEB3",
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#D2B48C",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  letterTileText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  floatingLetter: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFA500",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 1000,
  },
  floatingLetterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  refillButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  refillButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  shuffleButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleButtonText: {
    fontSize: 16,
  },
  passButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  passButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  hintButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  hintButtonText: {
    fontSize: 18,
  },
  debugInfo: {
    position: "absolute",
    top: 100,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
  },
  debugText: {
    color: "white",
    fontSize: 12,
  },
  resetButton: {
    backgroundColor: "#e67e22",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
