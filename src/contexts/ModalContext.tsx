import React, { useContext, useState, useCallback, useMemo } from "react";

type ModalContext = ModalViewState & {
    open: (modal: React.ReactNode) => void;
    close: () => void;
};

const noop = (...args: any[]) => {};

const ModalContext = React.createContext<ModalContext>({show: false, open: noop, close: noop});

type ModalViewState = {
    show: false
} | {
    show: true,
    modal: React.ReactNode
}

const ModalView: React.FC = ({children}) => {

    const [state, setState] = useState<ModalViewState>({
        show: false,
    });
    const open = useCallback((modal: React.ReactNode) => {
        setState({show: true, modal})
    }, [setState]);
    const close = useCallback(() => {
        setState({show: false})
    }, [setState]);
    const value = useMemo(() => ({
        ...state,
        open,
        close,
    }), [state, open, close]);

    return <ModalContext.Provider value={value}>
        {children}
        {state.show ? state.modal : null}
    </ModalContext.Provider>
};

export default ModalView;

