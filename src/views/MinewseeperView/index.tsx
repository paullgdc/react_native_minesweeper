import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Dimensions, Button } from 'react-native';
import MineSweeperState, * as op from "./model";
import Tile, { Visibility } from '../../components/Tile';
import CustomModal from '../../components/CustomModal';

interface MineSweeperProps {
  height: number,
  width: number,
  bombs: number,
}

const MineSweeper: React.FC<MineSweeperProps> = props => {
  const [state, setState] = useState<MineSweeperState>(
    op.init(props.width, props.height, props.bombs)
  )
  const [visible, setVisible] = useState(false);
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

  // const { setVisible, Modal } = useEndModal(() => {
  //   console.log("reinitiulaizing modal")
  //   setState(op.init(props.width, props.height, props.bombs));
  // });
  useEffect(() => {
    console.log("called effect", state.playState )
    if(state.playState !== "playing") {
      setVisible(true);
    }
  }, [state.playState])
  return <>
    <CustomModal visible={visible}>
      <Button title="close modal" onPress={() => setVisible(false)}/>
    </CustomModal>
    <ScrollView style={{ width: 0.8 * SCREEN_WIDTH }}>
      <MinesweeperGrid
        grid={state.grid} height={state.height} width={state.width}
        handlePress={handlePress} handleLongPress={handleLongPress}
      />
    </ScrollView>
  </>
};


export default MineSweeper;
