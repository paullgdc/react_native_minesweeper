import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import Colors from "../colors";

export enum TileKind {
    Bomb,
    Void,
}

export enum Visibility {
    Revealed = "revealed",
    Hidden = "hidden",
    Flagged = "flagged",
}

export type TileModel = ({
    kind: TileKind.Bomb;
} | {
    kind: TileKind.Void;
    neighboringBombNb: number;
}) & {
    visibility: Visibility
}

export interface TileProps {
    model: TileModel;
    onPress?: () => void;
    onLongPress?: () => void;
}

const Tile: React.FC<TileProps> = props => <TouchableOpacity
    onPress={props.onPress}
    onLongPress={props.onLongPress}
    style={[
        styles.fixedRatio,
        styles[props.model.visibility]
    ]}
>  
    <Text>{props.model.visibility === Visibility.Revealed ? 
        props.model.kind ? props.model.neighboringBombNb : "bomb" :
        ""}</Text>
</TouchableOpacity>;

const styles = StyleSheet.create({
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
        borderColor: "white",
        borderWidth: StyleSheet.hairlineWidth,
    },
    [Visibility.Hidden]: {
        backgroundColor: Colors.DarkBlue,
    },
    [Visibility.Revealed]: {
        backgroundColor: Colors.PictonBlue,
    },
    [Visibility.Flagged]: {
        backgroundColor: "red",
    }
});

export default Tile;
