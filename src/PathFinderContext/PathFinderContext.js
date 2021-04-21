import { createContext, useState } from 'react'


export const PathFinderContext = createContext()

export function PathFinderProvider(props){

        const [nodes, setNodes] = useState(['hi ', 'there ', ':)'])

    return (
        <PathFinderContext.Provider 
        value={{
            nodes, setNodes
        }}>
            {props.children}
        </PathFinderContext.Provider>
    )
}