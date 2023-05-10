import React, {useState} from 'react';

export const UpdatesContext = React.createContext();

export const UpdatesContextProvider = ({children}) => {
    // This context allows various areas of the app to communicate with each other when an item is created, updated, or deleted.
    // This is needed because the app is split into multiple areas which are not aware of each other.
    // For example, when a pantry item is deleted, the pantry item list needs to be updated to reflect the change.
    // This is done by setting the deleted state in the updates context and then the pantry item list will update itself based on the change.
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