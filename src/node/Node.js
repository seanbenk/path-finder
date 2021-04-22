import './Node.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'

export default function Node(props){

    function getNodeClasses(){
        return `node${props.isStartPoint?' start-node':''}${props.isEndPoint?' end-node':''}${props.isWall?' wall-node':''}${props.isVisited?' visited-node':''}`
    }

    return (
        <div className={getNodeClasses()}>
        </div>
    )
}