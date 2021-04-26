import './PathFinderGrid.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import Node from '../Node/Node.js'

export default function PathFinderGrid(){

    const { nodesGrid, setIsMouseDown, selectNode, runDijkstra, resetGrid, newMaze, gridMode, toggleGridMode } = useContext(PathFinderContext)

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
                                        isPath: node.isPath,
                                        gridMode,
                                        roadType: getRoadType(node)
                                    }}/>                            
                                )
                            })
                        )
                })}
            </section>
        )
    }

    function getRoadType(node){
        //nNodes = neighbourNodes
        const nNodes = node.getNeighbourCoords().map(coord => nodesGrid[coord.row][coord.col]).filter(node => !node.isWall && !node.isStartPoint && !node.isEndPoint)

        switch(nNodes.length){
            case 0:
                return 'all-road'
                break;
            case 1:
                {const[nn1] = nNodes
                    if(nn1.row > node.row){
                        return 'single-road-bottom'
                    } else if(nn1.row < node.row){
                        return 'single-road-top'
                    }
                    else if(nn1.col < node.col){
                        return 'single-road-left'
                    } else if(nn1.col > node.col){
                        return 'single-road-right'
                    }
                }
                return 'straight-road'
                break;
            case 2:
                {const[nn1, nn2] = nNodes
                if(nn1.col === nn2.col){
                    return 'straight-road-vertical'
                } else if(nn1.row === nn2.row){
                    return 'straight-road-horizontal'
                } else if((nn1.row < node.row || nn2.row < node.row) && (nn1.col < node.col || nn2.col < node.col)){
                    return 'corner-road-left-up'
                } else if((nn1.row > node.row || nn2.row > node.row) && (nn1.col < node.col || nn2.col < node.col)){
                    return 'corner-road-left-down'
                } else if((nn1.row < node.row || nn2.row < node.row) && (nn1.col > node.col || nn2.col > node.col)){
                    return 'corner-road-right-up'
                } else if((nn1.row > node.row || nn2.row > node.row) && (nn1.col > node.col || nn2.col > node.col)){
                    return 'corner-road-right-down'
                }}                   
                break;
            case 3:
                const [nn1, nn2, nn3] = nNodes
                if((nn1.row <= node.row) && (nn2.row <= node.row) && (nn3.row <= node.row)){
                    return 't-int-road-bottom'
                } else if(((nn1.row >= node.row) && (nn2.row >= node.row) && (nn3.row >= node.row))){
                    return 't-int-road-top'
                } else if(((nn1.col >= node.col) && (nn2.col >= node.col) && (nn3.col >= node.col))){
                    return 't-int-road-left'
                }
                return 't-int-road-right'
                break;
            case 4:
                return 'all-road'
                break;
        }
        return 'all-road'
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
            <nav>
                <ul>
                    <li onClick={runDijkstra}>Find Shortest Path</li>
                    <li onClick={newMaze}>Generate Maze</li>
                    <li onClick={resetGrid}>Reset Grid</li>
                    <li onClick={toggleGridMode}>Grid/Road</li>
                </ul>
            </nav>
            <section className="grid-section">
                {renderNodesGrid()}
            </section>
        </div>
    )
}

function nodeCornerPosition(node, nNodes){

}