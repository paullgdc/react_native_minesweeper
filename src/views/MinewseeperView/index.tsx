import React, { useState, useEffect } from 'react';
import { Text, ScrollView, Dimensions, Button, StyleSheet, View } from 'react-native';
import MineSweeperState, * as op from "./state";
import { Visibility } from '../../components/Tile';
import CustomModal from '../../components/CustomModal';
import MinesweeperGrid from '../../components/MinesweeperGrid';
import LabelledCounter from '../../components/LabelledCounter';
import HorizontalDivider from '../../components/HorizontalDivider';

const SCREEN_WIDTH = Dimensions.get('window').width;

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

  const handlePress = (x: number, y: number) => () => {
    if (state.playState !== "playing") return;
    if (state.grid[x][y].visibility === Visibility.Flagged) return;
    let newState = state;
    if (state.bombs === undefined)
      newState = op.placeBombs(state, { x, y });
    setState(op.revealTile(newState, { x, y }));
  };

  const handleLongPress = (x: number, y: number) => () => {
    if (state.playState !== "playing") return;
    let nState = state;
    if (state.bombs === undefined) {
      nState = op.placeBombs(nState, { x, y })
    }
    setState(op.toogleFlagged(nState, { x, y }));
  };

  useEffect(() => {
    if (state.playState !== "playing") {
      setVisible(true);
    }
  }, [state.playState])
  return <>
    <CustomModal
      visible={visible}
      onClose={() => {
        if (state.playState !== "playing") {
          setState(op.init(state.width, state.height, state.bombNumber));
        }
      }}
    >
      <Text style={styles.popupText}>
        {(() => {
          switch (state.playState) {
            case "won":
              return "You won!"
            case "lost":
              return "You lost!"
          }
        })()}
      </Text>
      <Button title="close modal" onPress={() => {
        setVisible(false);
      }} />
    </CustomModal>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <LabelledCounter label="Bombs" value={state.bombNumber.toString()} />
      <HorizontalDivider />
      <LabelledCounter label="Flags" value={state.flagNumber.toString()} />
    </View>
    <ScrollView style={{ width: 0.8 * SCREEN_WIDTH }}>
      <MinesweeperGrid
        grid={state.grid} height={state.height} width={state.width}
        handlePress={handlePress} handleLongPress={handleLongPress}
      />
    </ScrollView>
  </>
};

const styles = StyleSheet.create({
  popupText: {
    fontSize: 20,
    fontWeight: "bold",
  },
})


export default MineSweeper;
