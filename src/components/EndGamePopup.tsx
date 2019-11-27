import React from "react";
import { Button, Text, StyleSheet } from "react-native";

export interface EndGamePopupProps {
    text: string;
    onClose: () => void;
    buttonTitle: string;
}

const EndGamePopup: React.FC<EndGamePopupProps> = props => (<>
    <Text style={styles.popupText}>
        {props.text}
    </Text>
    <Button title={props.buttonTitle} onPress={props.onClose} />
</>);

const styles = StyleSheet.create({
    popupText: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default EndGamePopup;
