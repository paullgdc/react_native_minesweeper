import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../colors";
import NumericalInput from "./NumericInput";

export interface LabelledInputProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
}

const LabelledInput: React.FC<LabelledInputProps> = props => (
    <View style={styles.container}>
        <View style={styles.label}>
            <Text style={styles.text}>{props.label}</Text>
        </View>
        <View style={styles.input}>
            <NumericalInput numValue={props.value} onNumValueChange={props.onValueChange}/>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LightGray,
        borderRadius: 3,
        flexDirection: "row",
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
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 2,
        backgroundColor: "white",
    }
});

export default LabelledInput;
