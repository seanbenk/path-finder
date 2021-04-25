import { cloneDeep, shuffle, sample, remove } from 'lodash'
import { getNewGrid } from '../PathFinderContext/PathFinderContext.js'

export function generateMaze(grid){
    const { startPoint, endPoint } = findGridStartEnd(grid)
    grid = getNewGrid(grid[0].length, grid.length, startPoint, endPoint)
    grid[startPoint.row][startPoint.col].isStartPoint = true
    grid[startPoint.row][startPoint.col].isVisitedMAZE = true
    grid[endPoint.row][endPoint.col].isEndPoint = true
    const currPath = []
    currPath.push(grid[startPoint.row][startPoint.col])

    //!currPath[currPath.length - 1].isEndPoint
    
    let count = 0

    while(count < 10){
        console.log('hi')
        const currNode = currPath[currPath.length - 1]
        // grab the last element of the currPath array and find it's neighbour nodes, then get only the nodes that aren't walls
        const neighbourNodes = shuffle(currNode.getNeighbourCoords().map(coord => grid[coord.row][coord.col]).filter(node => !node.isVisitedMAZE))
        neighbourNodes.forEach(node => node.isVisitedMAZE = true)
        currPath.push(neighbourNodes.pop())
        neighbourNodes.forEach(node => {
            grid[node.row][node.col].isWall = true
        });
        count++
    }
    return grid
}

export function primsMazeGen(grid){
    const { startPoint, endPoint } = findGridStartEnd(grid)
    const wallGrid = grid.map((row, rowIdx) => row.map((node, colIdx) => ({type:'wall', row: rowIdx, col: colIdx})))
    const wallList = []
    wallGrid[startPoint.row][startPoint.col].type = 'path'
    getNeighbourCoords(wallGrid, startPoint.row, startPoint.col).forEach(coord => wallList.push(wallGrid[coord.row][coord.col]))

    while (wallList.length > 0){
        const selectedWall = sample(wallList)
        if(neighbourPathCount(wallGrid, selectedWall) < 2){
            selectedWall.type = 'path'
            getNeighbourCoords(grid, selectedWall.row, selectedWall.col).forEach(coord => wallList.push(wallGrid[coord.row][coord.col]))
        }
        remove(wallList, wall => wall.row === selectedWall.row && wall.col === selectedWall.col)
    }

    return(wallGrid)
}

function getNeighbourCoords(grid, pointRow, pointCol){
    const neighbourArr = []
    neighbourArr.push({row: pointRow + 1, col: pointCol})
    neighbourArr.push({row: pointRow, col: pointCol + 1})
    neighbourArr.push({row: pointRow - 1, col: pointCol})
    neighbourArr.push({row: pointRow, col: pointCol - 1})
    return neighbourArr
        .filter(node => node.row >= 0 && node.col  >= 0)
        .filter(node => node.row < grid[0].length  && node.col  < grid.length)
}

function neighbourPathCount(grid, wall){
    return getNeighbourCoords(grid, wall.row, wall.col).map(coord => grid[coord.row][coord.col]).filter(node => node.type === 'path').length
}

export function findGridStartEnd(grid){
    const coords = { startPoint: {}, endPoint: {} }
    for(const row of grid){
        for(const node of row){
            if(node.isStartPoint){
                coords.startPoint.row = node.row
                coords.startPoint.col = node.col
            }
            if(node.isEndPoint){
                coords.endPoint.row = node.row
                coords.endPoint.col = node.col
            }
        }
    }
    return coords
}