import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export enum TileKind {
    Bomb,
    Void,
}

export enum VisibilityKind {
    Revealed,
    Hidden,
    Flagged,
}

export type TileModel = ({
    kind: TileKind.Bomb;
} | {
    kind: TileKind.Void;
    neighboringBombNb: number;
}) & {
    visibility: VisibilityKind
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
        props.model.visibility === VisibilityKind.Flagged ?
            styles.revealed :
            styles.hidden
    ]}
>  
    <Text>{props.model.kind ? props.model.neighboringBombNb : "bomb"}</Text>
</TouchableOpacity>;

const styles = StyleSheet.create({
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    hidden: {
        backgroundColor: "blue",
    },
    revealed: {
        backgroundColor: "grey",
    }
});

export default Tile;
