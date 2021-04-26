import { createContext, useState } from 'react'
import { cloneDeep } from 'lodash'
import dijkstra from '../dijkstra/dijkstra.js'
import { findGridStartEnd, primsMazeGen } from '../mazeGeneration/mazeGeneration.js'


export const PathFinderContext = createContext()

export function PathFinderProvider(props){

    const [nodesGrid, setNodesGrid] = useState(getNewGrid(21, 21, {row: 4, col: 3}, {row: 4, col: 6}))

    const [isMouseDown, setIsMouseDown] = useState(false)

    const [selectedNode, setSelectedNode] = useState(null)

    //Takes a width and height and new start/end points, reset the nodes 
    const makeNewGrid = (width, height, startPointCoord, endPointCoord) => {
        setNodesGrid(getNewGrid(width, height,startPointCoord,endPointCoord))
    }

    const selectNode = (row, col) => {
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
        setNodesGrid((prevGrid) => {
            console.log(prevGrid)
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
    }

    const runDijkstra = () => {
        const { visitedNodesInOrder, nodesOfShortestPath } = dijkstra(nodesGrid)
        drawDijkstra(visitedNodesInOrder, nodesOfShortestPath)
    }

    const drawDijkstra = (visitedNodesInOrder, shortestPath, index = 0) => {
        if(index < visitedNodesInOrder.length){
            setNodesGrid((prevGrid) => {
                return addVisitedNode(prevGrid, visitedNodesInOrder[index])
            })
            setTimeout(() => {
                drawDijkstra(visitedNodesInOrder, shortestPath, index + 1)
            }, 0);
        } else {
            if(shortestPath){
                drawShortestPath(shortestPath)
            }
        }
    }

    const drawShortestPath = (shortestPath, index = 0) => {
        if(index < shortestPath.length){
            setNodesGrid((prevGrid) => {
                return addPathNode(prevGrid, shortestPath[index])
            })
            setTimeout(() => {
                drawShortestPath(shortestPath, index + 1)
            }, 100);
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

    return (
        <PathFinderContext.Provider 
        value={{
            nodesGrid, setNodesGrid, makeNewGrid, isMouseDown, setIsMouseDown, selectNode, updateNodes, selectedNode, resetGrid, runDijkstra, newMaze
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
            .filter(node => node.row < this.gridWidth  && node.col  < this.gridHeight)
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