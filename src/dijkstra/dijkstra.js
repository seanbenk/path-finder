import { flattenDeep, cloneDeep } from 'lodash'

export default function dijkstra(grid){
    //Clone the grid array and set our starting distance to 0 (everything else has a distance of Infinity)
    grid = cloneDeep(grid)

    const { startCoord, endCoord } = getStartEndCoords(grid)

    grid[startCoord.row][startCoord.col].distance = 0

    const visitedNodesInOrder = []
    const unvisitedNodes = flattenDeep(grid)

    let endPointFound = false

    while(!endPointFound){

        sortByDistance(unvisitedNodes)

        let currentNode = unvisitedNodes.shift()

        currentNode.getNeighbourCoords().forEach(coord => {
            unvisitedNodes[idxFromCoord(unvisitedNodes, coord.row, coord.col)].distance = currentNode.distance + 1
        });

        visitedNodesInOrder.push(currentNode)

        if(currentNode.isEnd === true){endPointFound = true}
    }
    return visitedNodesInOrder
}

function sortByDistance(arr){
    arr.sort((a, b) => a.distance - b.distance)
}

function idxFromCoord(arr, row, col){
    return arr.findIndex(node => node.row === row && node.col === col)
}

function getStartEndCoords(grid){
    const coords = {startCoord:{}, endCoord:{}}
    for(const row of grid){
        for(const node of row){
            if(node.isStartPoint){
                coords.startCoord.row = node.row
                coords.startCoord.col = node.col
            } else if(node.isEndPoint){
                coords.endCoord.row = node.row
                coords.endCoord.col = node.col
            }
        }
    }
    return coords
}