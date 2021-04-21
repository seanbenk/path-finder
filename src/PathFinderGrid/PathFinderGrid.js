import './PathFinderGrid.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'

export default function PathFinderGrid(){

    const { nodes } = useContext(PathFinderContext)


    return (
        <div>
            {nodes}
        </div>
    )
}