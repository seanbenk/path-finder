import './Node.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'

export default function Node(){

    const { nodes } = useContext(PathFinderContext)

    return (
        <div>
            a node
        </div>
    )
}