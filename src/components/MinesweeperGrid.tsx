import React from 'react';
import { View } from 'react-native';
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
    <View style={{ flexDirection: "row", aspectRatio: props.width / props.height }}>
        {props.grid.map((colum, i) => (
            <View key={i} style={{ flex: 1, flexDirection: "column", }}>
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

export default MinesweeperGrid;
