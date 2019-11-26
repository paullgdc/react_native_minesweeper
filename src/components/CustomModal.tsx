import React, { useEffect, useState } from "react";
import { StyleSheet, Animated, Dimensions, Easing } from "react-native";

const windowDims = Dimensions.get("window");

interface CustomModalProps {
    visible: boolean;
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

const CustomModal: React.FC<CustomModalProps> = props => {
    const [bottom] = useState(new Animated.Value(- windowDims.height));
    const [zIndex, setZIndex] = useState(-1);
    const [scale] = useState(new Animated.Value(1.0));
    console.log({ bottom, props })
    useEffect(() => {
        if (props.visible) {
            setZIndex(100);
        } else {
            Animated.timing(bottom, {
                toValue: - windowDims.height,
                duration: 1000,
            }).start(() => setZIndex(-1));
        }
    }, [props.visible]);
    useEffect(() => {
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

export default CustomModal;
