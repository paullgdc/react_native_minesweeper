import React, { useEffect, useState } from "react";
import { StyleSheet, Animated, Dimensions, Easing } from "react-native";

const windowDims = Dimensions.get("window");

interface ModalProps {
    visible: boolean;
    onClose: () => void;
}

const pulse = (value: Animated.Value, config: {
    duration: number,
    end: number,
    middle: number,
}) => {
    return Animated.sequence([
        Animated.timing(value, {
            duration: config.duration / 2,
            toValue: config.middle,
        }),
        Animated.timing(value, {
            duration: config.duration / 2,
            toValue: config.end,
        })
    ])
}

/**
 * Displays a modal popup when visible is set to true
 * This modal comes from the bottom of the screen to the
 * middle in 1000ms with an easeOut, then scales to 1.4
 * and then scales down to 1. in 500ms.
 * 
 * While the popup is raising, the screen also opacifies.
 */
const Modal: React.FC<ModalProps> = props => {
    const [bottom] = useState(new Animated.Value(- windowDims.height));
    const [zIndex, setZIndex] = useState(-1);
    const [scale] = useState(new Animated.Value(1.0));

    useEffect(() => {
        if (props.visible) {
            // React useState hooks doesn't allow callbacks,
            // So first we set the z-index of the modal wich
            // triggers a second useEffect when the component is re-rendered
            setZIndex(100);
        } else {
            const animation = Animated.timing(bottom, {
                toValue: - windowDims.height,
                duration: 1000,
            });
            animation.start(() => {
                setZIndex(-1);
                props.onClose();
            });
            return () => animation.stop();
        }
    }, [props.visible]);

    useEffect(() => {
        // When z-index has been updated we can start the animation.
        if (zIndex === 100) {
            Animated.sequence([
                Animated.timing(bottom, {
                    toValue: - windowDims.height / 2,
                    duration: 1000,
                    easing: Easing.out(Easing.ease)
                }),
                pulse(scale, {
                    duration: 500,
                    middle: 1.4,
                    end: 1,
                })
            ]).start();
        }
    }, [zIndex])

    return <Animated.View style={[styles.mainView, {
        zIndex,
        backgroundColor: bottom.interpolate({
            inputRange: [- windowDims.height, - windowDims.height / 2],
            outputRange: ["rgba(0, 0, 0, 0.0)", "rgba(0, 0, 0, 0.8)"]
        }),
    }]}>
        <Animated.View style={[styles.popup, { bottom, transform: [{ scale }] }]}>
            {props.children}
        </Animated.View>
    </Animated.View>
}
const styles = StyleSheet.create({
    mainView: {
        position: "absolute",
        top: 0,
        left: 0,
        width: windowDims.width,
        height: windowDims.height,
        alignItems: "center",
    },
    popup: {
        width: "70%",
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
    }
})

export default Modal;
