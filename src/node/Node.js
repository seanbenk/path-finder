import './Node.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'

export default function Node(props){

    const { isStartPoint, isEndPoint, isWall, isVisited, isPath, row, col } = props.data

    const { isMouseDown, updateNodes, selectedNode } = useContext(PathFinderContext)

    function getNodeClasses(){
        return `node${isStartPoint?' start-node':''}${isEndPoint?' end-node':''}${isWall?' wall-node':''}${isVisited?' visited-node':''}${isPath?' path-node':''}`
    }
    
    function mouseEnter(e){
        if(isMouseDown){
            updateNodes(row, col, selectedNode)
        }
    }

    return (
            <div 
                className={getNodeClasses()} data-row={row} data-col={col} onMouseEnter={mouseEnter}>
            </div>
    )
}