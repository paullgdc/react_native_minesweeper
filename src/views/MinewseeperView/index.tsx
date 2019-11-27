import React, { useState, useEffect } from 'react';
import { Text, ScrollView, Dimensions, Button, StyleSheet, View } from 'react-native';
import MineSweeperState, * as op from "./state";
import { Visibility } from '../../components/Tile';
import Modal from '../../components/Modal';
import MinesweeperGrid from '../../components/MinesweeperGrid';
import LabelledCounter from '../../components/LabelledCounter';
import HorizontalDivider from '../../components/HorizontalDivider';
import EndGamePopup from '../../components/EndGamePopup';

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
    setState(s => op.revealTile(s, { x, y }));
  };

  const handleLongPress = (x: number, y: number) => () => {
    setState(s => op.toogleFlagged(s, { x, y }));
  };

  useEffect(() => {
    if (state.playState !== "playing") {
      setVisible(true);
    }
  }, [state.playState])
  return <>
    <Modal
      visible={visible}
      onClose={() => {
        if (state.playState !== "playing") {
          setState(op.init(state.width, state.height, state.bombNumber));
        }
      }}
    >
      <EndGamePopup
        text={(() => {
          switch (state.playState) {
            case "won":
              return "You won!"
            case "lost":
              return "You lost!"
            default:
              return ""
          }
        })()}
        onClose={() => { setVisible(false); }}
        buttonTitle="Retry"
      />
    </Modal>
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

export default MineSweeper;
