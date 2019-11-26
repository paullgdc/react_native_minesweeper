import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
                <Icon name="bomb" color="red" size={15}/>) :
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
        backgroundColor: "red",
    }
});

export default Tile;
