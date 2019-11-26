import React from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";

const windowDims = Dimensions.get("window");

interface CustomModalProps {
    visible: boolean;
}

const CustomModal: React.FC<CustomModalProps> = props => props.visible ?
    <View style={styles.mainView}>
        <Animated.View style={styles.popup}>
            {props.children}
        </Animated.View>
    </View> :
    null;

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: "black",
        opacity: 0.8,
        position: "absolute",
        top: 0,
        left: 0,
        width: windowDims.width,
        height: windowDims.height,
        zIndex: 100,
        alignItems: "center",
    },
    popup: {
        width: "80%",
        backgroundColor: "white",
    }
})

export default CustomModal;