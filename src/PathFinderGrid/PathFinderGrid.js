import './PathFinderGrid.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import Node from '../Node/Node.js'

export default function PathFinderGrid(){

    const { nodesGrid, setIsMouseDown, selectNode, runDijkstra, resetGrid,  newMaze } = useContext(PathFinderContext)

    const renderNodesGrid = () => {
        return (
            <section className='path-finder-grid' onMouseDown={setMouseDown} onMouseUp={setMouseUp} onContextMenu={e => e.preventDefault()}>
                {nodesGrid.map(currentRow => {
                        return (currentRow.map((node, nodeIdx) => {
                            return (
                                        <Node
                                        key={node.id} 
                                        data={{
                                        row: node.row,
                                        col: node.col,
                                        isStartPoint: node.isStartPoint,
                                        isEndPoint: node.isEndPoint,
                                        isWall: node.isWall,
                                        isVisited: node.isVisited,
                                        isPath: node.isPath
                                    }}/>                            
                                )
                            })
                        )
                })}
            </section>
        )
    }

    function setMouseDown(e){
        setIsMouseDown(true)
        selectNode(e.target.dataset.row, e.target.dataset.col)
    }

    function setMouseUp(){
        setIsMouseDown(false)
    }

    return (
        <div>
            <div>
                <button onClick={runDijkstra}>Dijkstra</button>
                <button onClick={resetGrid}>Reset Grid</button>
                <button onClick={newMaze}>New Maze</button>
            </div>
                {renderNodesGrid()}
        </div>
    )
}