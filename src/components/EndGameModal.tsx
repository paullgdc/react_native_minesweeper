import React, { useState } from 'react';
import { Modal, View, Text, Button } from "react-native";
import CustomModal from './CustomModal';

interface EndGameModalProps {
    onClose: () => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const EndGameModal: React.FC<EndGameModalProps> = props => {
    console.log("modal should be visible", props.visible);
    return <CustomModal
        visible={props.visible}
        >
        <View style={{marginTop: 22}}>
        <View>
            <Text>Hello World!</Text>

            <Button
                onPress={() => {
                    props.setVisible(false);
                    props.onClose();
                }}
                title="Retry"
            />
        </View>
        </View>
    </CustomModal>;
};

export const useEndModal = (onClose: () => void): {
    setVisible: (visible: boolean) => void,
    Modal: React.ReactNode,
} => {
    const [visible, setVisible] =  useState<boolean>(false);
    console.log(visible);
    const changeVisibility = React.useCallback((visible: boolean) => setVisible(visible), [setVisible]);
    return React.useMemo(() => ({
        setVisible: changeVisibility,
        Modal: <EndGameModal
            onClose={onClose}
            setVisible={changeVisibility}
            visible={visible}
        />
    }), [visible, setVisible, onClose, EndGameModal])
}