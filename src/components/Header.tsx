import React from 'react';
import { View, StyleSheet, Text } from "react-native";

export interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
    <View style={styles.header}>
        <View style={styles.innerView}>
            <Text style={styles.text}>{title}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    header: {
        paddingVertical: 5,
        marginBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "black",
        textAlign: "center",
        flexDirection: "row",
    },
    innerView: {
        flex: 1,
        alignItems: "center"
    },
    text: {
        fontSize: 35,
        fontWeight: "700",
    },
})

export default Header;