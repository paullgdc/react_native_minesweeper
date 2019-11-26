import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import MineSweeperState, * as op from "./model";
import Tile, { TileKind, Visibility } from '../../components/Tile';
import { useEndModal } from '../../components/EndGameModal';

interface MineSweeperProps {
  height: number,
  width: number,
  bombs: number,
}

const MineSweeper: React.FC<MineSweeperProps> = props => {
  const [state, setState] = useState<MineSweeperState>(
    op.init(props.width, props.height, props.bombs)
  )
  console.log("rerender")

  const handlePress = (x: number, y: number) => () => {
    if (state.playState !== "playing") return;
    if(state.grid[x][y].visibility === Visibility.Flagged) return;
    let newState = state;
    if(state.bombs === undefined) 
      newState = op.placeBombs(state, {x, y});
    setState(op.revealTile(newState, {x, y}));
  };

  const handleLongPress = (x: number, y: number) => () => {
    if (state.playState !== "playing") return;
    let nState = state;
    if(state.bombs === undefined) {
      nState = op.placeBombs(nState, {x, y})
    }
    setState(op.toogleFlagged(nState, {x, y}));
  }

  const { setVisible, Modal } = useEndModal(() => {
    console.log("reinitiulaizing modal")
    setState(op.init(props.width, props.height, props.bombs));
  });
  useEffect(() => {
    console.log("called effect", state.playState )
    if(state.playState !== "playing") {
      setVisible(true);
    }
  }, [state.playState])
  return <>
    {Modal}
    <View style={{ flexDirection: "row", aspectRatio: props.width / props.height }}>
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
    <Text>{state.playState}</Text>
  </>
};


export default MineSweeper;
