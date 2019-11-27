import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../colors";

export interface LabelledCounterProps {
    label: string;
    value: string;
}

/**
 * Display a value with an adjacent label.
 * The style is inspired from semantic-ui input with labels
 */
const LabelledCounter: React.FC<LabelledCounterProps> = props => (
    <View style={styles.container}>
        <View style={styles.label}>
            <Text style={styles.text}>{props.label}</Text>
        </View>
        <View style={styles.input}>
            <Text>{props.value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LightGray,
        borderRadius: 3,
        flexDirection: "row",
        flex: 0,
        marginBottom: 2,
    },
    text: {
        fontWeight: "bold",
    },
    label: {
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    input: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        backgroundColor: "white",
    }
});

export default LabelledCounter;
