import React from 'react'
import { createContext } from 'react';

export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const value = {
        // Add global state values and functions here
    };  

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;