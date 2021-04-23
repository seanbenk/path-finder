import './PathFinderGrid.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import Node from '../Node/Node.js'
import { dijkstra } from '../dijkstra/dijkstra.js'

export default function PathFinderGrid(){

    const { nodesGrid, makeNewGrid, setIsMouseDown, selectNode, runDijkstra, resetGrid } = useContext(PathFinderContext)

    const renderNodesGrid = () => {
        return (
            <section className='path-finder-grid' onMouseDown={setMouseDown} onMouseUp={setMouseUp}>
                {nodesGrid.map(currentRow => {
                        return (currentRow.map((node, nodeIdx) => {
                            return (
                                        <Node
                                        key={node.id} 
                                        data={{
                                        id: node.id,
                                        row: node.row,
                                        col: node.col,
                                        isStartPoint: node.isStartPoint,
                                        isEndPoint: node.isEndPoint,
                                        isWall: node.isWall,
                                        isVisited: node.isVisited
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
                {/* <button onClick={runDijkstra}>Dijkstra</button> */}
                <button onClick={resetGrid}>Reset Grid</button>
            </div>
                {renderNodesGrid()}
        </div>
    )
}