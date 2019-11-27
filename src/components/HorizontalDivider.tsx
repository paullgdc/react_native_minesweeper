import React from "react";
import { View, StyleSheet } from "react-native";

const HorizontalDivider: React.FC = () => (
    <View style={styles.divider} />
);

const styles = StyleSheet.create({
    divider: {
        width: 5,
    }
});

export default HorizontalDivider;
