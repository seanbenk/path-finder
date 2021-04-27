import { createContext, useState } from 'react'
import { random, sample, cloneDeep } from 'lodash'
import dijkstra from '../dijkstra/dijkstra.js'
import { findGridStartEnd, primsMazeGen } from '../mazeGeneration/mazeGeneration.js'


export const PathFinderContext = createContext()

export function PathFinderProvider(props){

    const [showTutorial, setShowTutorial] = useState(true)

    const [nodesGrid, setNodesGrid] = useState(getNewGrid(25, 10, {row: 4, col: 4}, {row: 4, col: 20}))

    const [isMouseDown, setIsMouseDown] = useState(false)

    const [selectedNode, setSelectedNode] = useState(null)

    const [isGridMode, setIsGridMode] = useState(true)

    const [blockClicks, setBlockClicks] = useState(false)

    const [justDrawn, setJustDrawn] = useState(false)

    const [nodeImages, setNodeImages] = useState(createImgGrid())

    function createImgGrid(){
        const images = ['tree1', 'tree2', 'fireHydrant']
        return nodesGrid.map(row => row.map(node => {
            if(random(0,4) < 4){return ''}
                return sample(images)
        }))
    }

    function toggleGridMode(){
        setIsGridMode(prevMode => !prevMode)
    }

    //Takes a width and height and new start/end points, reset the nodes 
    const makeNewGrid = (width, height, startPointCoord, endPointCoord) => {
        setNodesGrid(getNewGrid(width, height,startPointCoord,endPointCoord))
    }

    const selectNode = (row, col) => {
        if(justDrawn){resetIsVisitedAndPath()}
        setSelectedNode(() => {
                updateNodes(row, col, nodesGrid[Number(row)][Number(col)])
                return nodesGrid[Number(row)][Number(col)]
        })
    }

    const updateNodes = (row, col, selectedNode) => {
        const newArr = cloneDeep(nodesGrid)
        const currNode = newArr[row][col]
        if(selectedNode.isStartPoint){
            for(const row of newArr){
                for(const node of row){
                    node.isStartPoint = false
                }
            }
            currNode.isStartPoint = true
            currNode.isEndPoint = false
            currNode.isWall = false
        } else if(selectedNode.isEndPoint){
            for(const row of newArr){
                for(const node of row){
                    node.isEndPoint = false
                }
            }
            currNode.isStartPoint = false
            currNode.isEndPoint = true
            currNode.isWall = false
        } else if(selectedNode.isWall && !currNode.isStartPoint && !currNode.isEndPoint){
            currNode.isStartPoint = false
            currNode.isEndPoint = false
            currNode.isWall = false
        } else if(!currNode.isStartPoint && !currNode.isEndPoint){
            currNode.isStartPoint = false
            currNode.isEndPoint = false
            currNode.isWall = true
        }
        setNodesGrid(newArr)
    }

    const resetGrid = () => {
        if(isGridMode){
            setNodeImages(createImgGrid)
            setNodesGrid((prevGrid) => {
                return prevGrid.map(row => {
                    return row.map( node => {
                        node.isWall = false
                        node.isVisited = false
                        node.isPath = false
                        node.distance = Infinity
                        return node
                    })
                })
            })
        } else {
            setNodeImages(createImgGrid)
            setNodesGrid((prevGrid) => {
                return prevGrid.map(row => {
                    return row.map( node => {
                        node.isWall = node.isEndPoint||node.isStartPoint?false:true
                        node.isVisited = false
                        node.isPath = false
                        node.distance = Infinity
                        return node
                    })
                })
            })
        }
    }

    const runDijkstra = () => {
        const { visitedNodesInOrder, nodesOfShortestPath } = dijkstra(nodesGrid)
        setBlockClicks(true)
        setJustDrawn(true)
        resetIsVisitedAndPath()
        drawDijkstra(visitedNodesInOrder, nodesOfShortestPath)
    }

    const drawDijkstra = (visitedNodesInOrder, shortestPath, index = 0) => {
        if(index < visitedNodesInOrder.length && isGridMode){
            setNodesGrid((prevGrid) => {
                return addVisitedNode(prevGrid, visitedNodesInOrder[index])
            })
            setTimeout(() => {
                drawDijkstra(visitedNodesInOrder, shortestPath, index + 1)
            }, 0);
        } else {
            if(shortestPath){
                drawShortestPath(shortestPath)
            } else{ setBlockClicks(false) }
        }
    }

    const drawShortestPath = (shortestPath, index = 0) => {
        if(isGridMode){
            if(index < shortestPath.length){
                setNodesGrid((prevGrid) => {
                    return addPathNode(prevGrid, shortestPath[index])
                })
                setTimeout(() => {
                    drawShortestPath(shortestPath, index + 1)
                }, 100);
            } else { setBlockClicks(false) }
        } else {
            //If in road mode
            if(index < shortestPath.length-1){
                setNodesGrid((prevGrid) => {
                    const newNodesGrid = addPathNode(prevGrid, shortestPath[index])
                    newNodesGrid[shortestPath[index].row][shortestPath[index].col].isCar = true
                    if(index > 0){
                        newNodesGrid[shortestPath[index-1].row][shortestPath[index-1].col].isCar = false                      
                    }
                    return newNodesGrid
                })
                setTimeout(() => {
                    drawShortestPath(shortestPath, index + 1)
                }, 100);
            } else { setBlockClicks(false) }
        }
        
    }

    const addVisitedNode = (grid, coord) =>{
        return grid.map(row => {
            return row.map( node => {
                if(node.row === coord.row && node.col === coord.col){
                    node.isVisited = true
                    return node
                } else{ return node }
            }) 
        })
    }

    const addPathNode = (grid, coord) =>{
        return grid.map(row => {
            return row.map( node => {
                if(node.row === coord.row && node.col === coord.col){
                    node.isPath = true
                    return node
                } else{ return node }
            }) 
        })
    }

    const newMaze = () => {
        const { startPoint, endPoint } = findGridStartEnd(nodesGrid)
        let idCounter = -1
        const newMaze = primsMazeGen(nodesGrid).map((row, rowIdx) => row.map((node, colIdx) => {
            idCounter++
            if(node.type === 'path'){
                return new NodeObj(idCounter, rowIdx, colIdx, false, false, nodesGrid[0].length, nodesGrid.length)
            }
            return new NodeObj(idCounter, rowIdx, colIdx, false, false, nodesGrid[0].length, nodesGrid.length, true)
        }))
        newMaze[startPoint.row][startPoint.col].isStartPoint = true
        newMaze[endPoint.row][endPoint.col].isWall = false
        newMaze[endPoint.row][endPoint.col].isEndPoint = true
        setNodesGrid(newMaze)
    }

    const resetIsVisitedAndPath = () => {
        setNodesGrid(prevGrid => {
            return prevGrid.map(row => row.map(node => {
                node.isVisited = false;
                node.isPath = false;
                return node
            }))
        })
    }

    return (
        <PathFinderContext.Provider 
        value={{
            showTutorial, setShowTutorial, nodesGrid, setNodesGrid, makeNewGrid, isMouseDown, setIsMouseDown, selectNode, updateNodes, selectedNode, resetGrid, runDijkstra, newMaze, isGridMode, toggleGridMode, blockClicks, justDrawn, setJustDrawn, resetIsVisitedAndPath, nodeImages
        }}>
            {props.children}
        </PathFinderContext.Provider>
    )
}




class NodeObj{
    constructor(id, row, col, isStartPoint, isEndPoint, gridWidth, gridHeight, isWall = false, isVisited = false, isPath = false){
        this.id = id
        this.row = row
        this.col = col 
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.isStartPoint = isStartPoint
        this.isEndPoint = isEndPoint
        this.isWall = isWall
        this.isVisited = isVisited
        this.isPath = isPath
        this.distance = Infinity
        this.isVisitedMAZE = false
        this.isCar = false
    }
    //Gets the neighbouring coords of nodes that will exist in the current state (up, right, down, left)
    getNeighbourCoords(){
        const neighbourArr = []
        neighbourArr.push({row: this.row + 1, col: this.col})
        neighbourArr.push({row: this.row, col: this.col + 1})
        neighbourArr.push({row: this.row - 1, col: this.col})
        neighbourArr.push({row: this.row, col: this.col - 1})
        return neighbourArr
            .filter(node => node.row >= 0 && node.col  >= 0)
            .filter(node => node.row < this.gridHeight  && node.col  < this.gridWidth)
    }
}

export const getNewGrid = (width, height, startCoords, endCoords) => {
    const newGrid = []
    let nodeId = 0
    for(let row = 0; row < height; row++){
        const newRow = []
        for(let col = 0; col < width; col++){
            if(row === startCoords.row && col === startCoords.col){
                newRow.push(new NodeObj(nodeId,row,col,true,false,width,height))
            } else if(row === endCoords.row && col === endCoords.col){
                newRow.push(new NodeObj(nodeId,row,col,false,true,width,height))
            } else{
                newRow.push(new NodeObj(nodeId,row,col,false,false,width,height))
            }

            nodeId++;
        }
        newGrid.push(newRow)
    }
    return newGrid
}