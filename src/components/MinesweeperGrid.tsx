import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tile, { TileModel } from "./Tile";

export type Grid = TileModel[][];

export interface MinesweeperGridProps {
    grid: Grid;
    width: number;
    height: number;
    handlePress: (x: number, y: number) => () => void;
    handleLongPress: (x: number, y: number) => () => void;
};

const MinesweeperGrid: React.FC<MinesweeperGridProps> = props => (
    <View style={[
        styles.row,
        { aspectRatio: props.width / props.height }]
    }>
        {props.grid.map((colum, i) => (
            <View key={i} style={styles.column}>
                {colum.map((tile, j) => (
                    <Tile
                        key={j}
                        model={tile}
                        onPress={props.handlePress(i, j)}
                        onLongPress={props.handleLongPress(i, j)}
                    />
                ))}
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
    column: {
        flex: 1,
        flexDirection: "column",
    }
});

export default MinesweeperGrid;
