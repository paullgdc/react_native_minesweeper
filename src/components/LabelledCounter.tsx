import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import Colors from "../colors";

export interface LabelledCounterProps {
    label: string;
    value: string;
}

const LabelledCounter: React.FC<LabelledCounterProps> = props => (
    <View style={styles.container}>
        <View style={styles.label}>
            <Text style={styles.text}>{props.label}</Text>
        </View>
        <View style={styles.input}>
            <TextInput value={props.value} />
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
