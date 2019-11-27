import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import MineSweeperState, * as op from "./state";
import Modal from '../../components/Modal';
import MinesweeperGrid from '../../components/MinesweeperGrid';
import LabelledCounter from '../../components/LabelledCounter';
import HorizontalDivider from '../../components/HorizontalDivider';
import EndGamePopup from '../../components/EndGamePopup';
import LevelSelector from '../../components/LevelSelector';


interface MineSweeperProps {
    height: number,
    width: number,
    bombs: number,
}

const MineSweeper: React.FC<MineSweeperProps> = props => {
    const [visible, setVisible] = useState(false);

    const [gameState, setGameState] = useState<MineSweeperState>(
        op.init(props.width, props.height, props.bombs)
    )

    const handlePress = (x: number, y: number) => () => {
        setGameState(s => op.revealTile(s, { x, y }));
    };

    const handleLongPress = (x: number, y: number) => () => {
        setGameState(s => op.toogleFlagged(s, { x, y }));
    };

    useEffect(() => {
        // If the state of the game to "lost" or "won",
        // we show the modal
        if (gameState.playState !== "playing") {
            setVisible(true);
        }
    }, [gameState.playState])
    return <>
        <Modal
            visible={visible}
            onClose={() => {
                if (gameState.playState !== "playing") {
                    setGameState(op.init(gameState.width, gameState.height, gameState.bombNumber));
                }
            }}
        >
            <EndGamePopup
                text={(() => {
                    switch (gameState.playState) {
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
        <View style={styles.counters}>
            <LabelledCounter label="Bombs" value={gameState.bombNumber.toString()} />
            <HorizontalDivider />
            <LabelledCounter label="Flags" value={gameState.flagNumber.toString()} />
        </View>
        <ScrollView style={styles.gridContainer}>
            <MinesweeperGrid
                grid={gameState.grid} height={gameState.height} width={gameState.width}
                handlePress={handlePress} handleLongPress={handleLongPress}
            />
        </ScrollView>
        <LevelSelector
            onSelect={(w, h, b) => {
                setGameState(op.init(w, h, b))
            }}
            default={{ width: gameState.width, height: gameState.height, bombs: gameState.bombNumber }}
        />
    </>
};

const styles = StyleSheet.create({
    counters: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    gridContainer: {
        width: "80%"
    }
})

export default MineSweeper;
