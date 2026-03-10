import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableTile from './DraggableTile';

type TileObj = { id: string; char: string; originalIndex?: number };

type Props = {
  tiles: TileObj[];
  boardLayout: { x: number; y: number; width: number; height: number };
  rows: number;
  cols: number;
  tileSize?: number;
  snapThreshold?: number;
  onTileDropped: (tileId: string, r: number | null, c: number | null) => void;
  onTilePick?: (tileId: string) => void;
  isCellOccupied: (r: number, c: number) => boolean;
  tileLayerVersion?: number;
  isInteractive?: boolean;
};

export default function DraggableTileLayer({
  tiles,
  boardLayout,
  rows,
  cols,
  tileSize = 45,
  snapThreshold = 0.45,
  onTileDropped,
  onTilePick,
  isCellOccupied,
  tileLayerVersion = 0,
  isInteractive = true,
}: Props) {
  const homes = useMemo(() => {
    const spacing = tileSize + 12;
    const totalWd =
      tiles.length * tileSize + Math.max(0, tiles.length - 1) * 12;

    const startX = Math.max(0, (boardLayout.width - totalWd) / 2);
    const y =
      boardLayout.height && boardLayout.height > 0
        ? boardLayout.height + 18
        : tileSize + 18;

    return tiles.map((_, i) => ({ x: startX + i * spacing, y }));
  }, [tiles, boardLayout, tileSize]);

  const safeOnDrop = (tileId: string, r: number | null, c: number | null) => {
    if (!isInteractive) {
      return;
    }
    onTileDropped && onTileDropped(tileId, r, c);
  };

  const safeOnPick = (tileId: string) => {
    if (!isInteractive) return;
    onTilePick && onTilePick(tileId);
  };

  const wrapperPointer = isInteractive ? 'box-none' : 'none';

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      pointerEvents={wrapperPointer as any}
    >
      {tiles.map((tile, idx) => (
        <DraggableTile
          key={`${tile.id}-${tileLayerVersion}`}
          id={tile.id}
          char={tile.char}
          homeX={homes[idx]?.x ?? 0}
          homeY={homes[idx]?.y ?? 0}
          tileSize={tileSize}
          gridLayout={boardLayout}
          rows={rows}
          cols={cols}
          snapThreshold={snapThreshold}
          onDrop={safeOnDrop}
          onDragStart={safeOnPick}
          isCellOccupied={isCellOccupied}
          isInteractive={isInteractive}
        />
      ))}
    </View>
  );
}
