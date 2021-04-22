import './PathFinderGrid.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import Node from '../Node/Node.js'
import { dijkstra } from '../dijkstra/dijkstra.js'

export default function PathFinderGrid(){

    const { nodesGrid, makeNewGrid } = useContext(PathFinderContext)

    const renderNodesGrid = () => {
        return (
            <section className='path-finder-grid'>
                {nodesGrid.map(currentRow => {
                    return ( <div>
                        {currentRow.map((node, nodeIdx) => {
                        return (
                            <Node 
                            key={nodeIdx} 
                            data={{
                                isStartPoint: node.isStartPoint,
                                isEndPoint: node.isEndPoint,
                                isWall: node.isWall,
                                isVisited: node.isVisited
                                }}/>
                            )
                        })}
                        </div>
                    )
                })}
            </section>
        )
    }

    return (
        <div>
            <div>
                <button onClick={() => makeNewGrid(5,2)}>get grid</button>
                <button onClick={() => console.log(nodesGrid)}>log state</button>
            </div>
            <div className='path-finder-grid'>
                {renderNodesGrid()}
            </div>
        </div>
    )
}