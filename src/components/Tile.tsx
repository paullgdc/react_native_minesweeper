import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from "../colors";

/**
 * Represents the type of the tile
 */
export enum TileKind {
    Bomb,
    Void,
}

/**
 * Represents the fact that the tile is visible or hidden
 */
export enum Visibility {
    Revealed,
    Hidden,
    Flagged,
}

export interface Pos {
    x: number;
    y: number;
}

export interface BombTile {
    kind: TileKind.Bomb;
}

export interface VoidTile {
    kind: TileKind.Void;
    neighboringBombNb: number;
}

export type TileModel = (BombTile | VoidTile) & {
    visibility: Visibility,
    pos: Pos,
}

export interface TileProps {
    model: TileModel;
    onPress?: () => void;
    onLongPress?: () => void;
}

const Tile: React.FC<TileProps> = props => (
    <TouchableOpacity
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        style={[
            styles.fixedRatio,
            styles[props.model.visibility]
        ]}
    >
        {props.model.visibility === Visibility.Revealed ?
            (props.model.kind ? <Text>{props.model.neighboringBombNb}</Text> :
                <Icon name="bomb" color="red" size={15} />) :
            undefined
        }
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
        borderColor: "white",
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: "center",
        alignItems: "center",
    },
    [Visibility.Hidden]: {
        backgroundColor: Colors.DarkBlue,
    },
    [Visibility.Revealed]: {
        backgroundColor: Colors.PictonBlue,
    },
    [Visibility.Flagged]: {
        backgroundColor: Colors.Red,
    }
});

export default Tile;
