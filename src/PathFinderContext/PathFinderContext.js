import { createContext, useState } from 'react'


export const PathFinderContext = createContext()

export function PathFinderProvider(props){

    const [nodesGrid, setNodesGrid] = useState(getNewGrid(10,5))

    //Takes a width and height and reset the nodes 
    const makeNewGrid = (width, height) => {
        setNodesGrid(getNewGrid(width, height))
    }

    return (
        <PathFinderContext.Provider 
        value={{
            nodesGrid, makeNewGrid
        }}>
            {props.children}
        </PathFinderContext.Provider>
    )
}

class NodeObj{
    constructor(id, row, col, isStartPoint, isEndPoint, gridWidth, gridHeight, isWall = false, isVisited = false){
        this.id = id
        this.row = row
        this.col = col 
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.isStartPoint = isStartPoint
        this.isEndPoint = isEndPoint
        this.isWall = isWall
        this.isVisited = isVisited
        this.distance = Infinity
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

const getNewGrid = (width, height) => {
    const newGrid = []
    let nodeId = 0
    for(let row = 0; row < height; row++){
        const newRow = []
        for(let col = 0; col < width; col++){
            newRow.push(new NodeObj(nodeId,row,col,false,false,width,height))
            nodeId++;
        }
        newGrid.push(newRow)
    }
    return newGrid
}