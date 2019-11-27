import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import LabelledInput from "./LabelledInput";
import Colors from "../colors";

export interface LevelSelectorProps {
    onSelect: (width: number, height: number, bombs: number) => void;
    default: {
        width: number,
        height: number,
        bombs: number,
    }
}

/**
 * Select a difficulty by setting minesweeper width, height and count of bombs.
 */
const LevelSelector: React.FC<LevelSelectorProps> = props => {
    const [width, setWidth] = useState(props.default.height);
    const [height, setHeight] = useState(props.default.height);
    const [bombs, setBombs] = useState(props.default.bombs);
    return <View style={styles.container}>
        <View>
            <LabelledInput
                onValueChange={(newVal => {
                    setWidth(newVal);
                })}
                value={width}
                label="width"
            />
        </View>
        <View>
            <LabelledInput
                onValueChange={(newVal => {
                    setHeight(newVal);
                })}
                value={height}
                label="height"

            />
        </View>
        <View>
            <LabelledInput
                onValueChange={(newVal => {
                    if (newVal < height * width) {
                        setBombs(newVal);
                    }
                })}
                value={bombs}
                label="bombs"
            />
        </View>
        <TouchableOpacity
            onPress={() => props.onSelect(width, height, bombs)}
            style={styles.retryButton}
            activeOpacity={0.8}
        >
            <Text style={styles.retryText}>Restart</Text>
        </TouchableOpacity>
    </View>
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        width: "70%"
    },
    retryButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: Colors.PictonBlue,
    },
    retryText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    }
});


export default LevelSelector;
