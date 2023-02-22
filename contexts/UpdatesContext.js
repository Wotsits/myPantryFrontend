import React, {useState} from 'react';

export const UpdatesContext = React.createContext();

export const UpdatesContextProvider = ({children}) => {
    const [deleted, setDeleted] = useState(undefined)
    const [updated, setUpdated] = useState(undefined)
    const [created, setCreated] = useState(undefined)

    return (
        <UpdatesContext.Provider value={{
            deleted, updated, created, setDeleted, setUpdated, setCreated
        }}>
            {children}
        </UpdatesContext.Provider>
    )
}