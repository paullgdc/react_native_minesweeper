import React, { useState } from 'react';
import { Text, View } from 'react-native';
import MineSweeperState, * as op from "./model";
import Tile, { TileKind } from '../../components/Tile';

interface MineSweeperProps {
  height: number,
  width: number,
  bombs: number,
}

const MineSweeper: React.FC<MineSweeperProps> = props => {
  const [state, setState] = useState<MineSweeperState>(
    op.init(props.width, props.height, props.bombs)
  )
  const [game, setGame] = useState<"playing" | "lost" | "won">("playing");
  console.log("rerender")
  const handlePress = (x: number, y: number) => () => {
    if (game !== "playing") return;
    let newState = state;
    if(state.bombs === undefined) 
      newState = op.placeBombs(state, {x, y});
    setState(op.revealTile(newState, {x, y}));
  };
  const handleLongPress = (x: number, y: number) => () => {
    if (game !== "playing") return;
    if(state.bombs === undefined) setState(op.placeBombs(state, {x, y}))
    setState(op.flagTile(state, {x, y}));
  }
  return <>
    <View style={{ flexDirection: "row", aspectRatio: 1 }}>
      {state.grid.map((colum, i) => (
        <View key={i} style={{ flex: 1, flexDirection: "column", }}>
          {colum.map((tile, j) => (
            <Tile
              key={j}
              model={tile}
              onPress={handlePress(i, j)}
              onLongPress={handleLongPress(i, j)}
            />
          ))}
        </View>
      ))}
    </View>
    <Text>{game}</Text>
  </>
};


export default MineSweeper;
