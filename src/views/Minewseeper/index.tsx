import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { MineSweeperGrid, MineSweeperGridOp } from "./model";
import Tile from '../../components/Tile';

interface MineSweeperProps {
  height: number,
  width: number,
  bombs: number,
}

const MineSweeper: React.FC<MineSweeperProps> = props => {
  const [grid, setGrid] = useState<MineSweeperGrid>(
    MineSweeperGridOp.init(props.width, props.height, props.height, { x: -1, y: -1 })
  )
  const [game, setGame] = useState<"playing" | "lost" | "won">("playing");

  const handlePress = (i: number, j: number) => () => {
    if (game !== "playing") return;


  }
  return <>
    <View style={{ flexDirection: "row", aspectRatio: 1 }}>
      {grid.grid.map((colum, i) => (
        <View key={i} style={{ flex: 1, flexDirection: "column", }}>
          {colum.map((tile, j) => (
            <Tile key={j} model={tile} />
          ))}
        </View>
      ))}
    </View>
  </>
};


export default MineSweeper;
