import React from "react";
import { TextInput, TextInputProps } from "react-native";

export interface NumericalInputProps extends TextInputProps {
    numValue: number;
    onNumValueChange: (num: number) => void;
};

const NumericalInput: React.FC<NumericalInputProps> = props => (
    <TextInput
        onChangeText={(newValue => {
            const number = newValue === "" ?
                0 :
                Number.parseInt(newValue, 10);
            if (!Number.isNaN(number) && number >= 0) {
                props.onNumValueChange(number);
            }
        })}
        value={props.numValue.toString()}
        {...props}
    />
);

export default NumericalInput;
