import { flattenDeep, cloneDeep } from 'lodash'

export default function dijkstra(grid){
    //Clone the grid array and set our starting distance to 0 (everything else has a distance of Infinity)
    grid = cloneDeep(grid)

    const startCoord = getStartCoord(grid)

    grid[startCoord.row][startCoord.col].distance = 0

    const visitedNodesInOrder = []
    const unvisitedNodes = flattenDeep(grid)

    let endPointFound = false

    while(!endPointFound){

        sortByDistance(unvisitedNodes)

        const currentNode = unvisitedNodes.shift()

        currentNode.getNeighbourCoords().forEach(coord => {
            const node = unvisitedNodes[idxFromCoord(unvisitedNodes, coord.row, coord.col)]
            if(node && !node.isWall){
                unvisitedNodes[idxFromCoord(unvisitedNodes, coord.row, coord.col)].distance = currentNode.distance + 1
            }
        });

        visitedNodesInOrder.push(currentNode)

        if(currentNode.isEndPoint){endPointFound = true}
    }
    
    const nodesOfShortestPath = getShortestPath(visitedNodesInOrder)

    return {  visitedNodesInOrder, nodesOfShortestPath }
}

function sortByDistance(arr){
    arr.sort((a, b) => a.distance - b.distance)
}

function idxFromCoord(arr, row, col){
    return arr.findIndex(node => node.row === row && node.col === col)
}

function getStartCoord(grid){
    const coords = {}
    for(const row of grid){
        for(const node of row){
            if(node.isStartPoint){
                coords.row = node.row
                coords.col = node.col
            }
        }
    }
    return coords
}

function getShortestPath(visitedNodes){
    
    const shortestPath = []
    visitedNodes = cloneDeep(visitedNodes).reverse()
    let currNode = visitedNodes.shift()

    while(currNode.distance !== 0){
        shortestPath.unshift(currNode)
        currNode.getNeighbourCoords().forEach(coord => {
            if(idxFromCoord(visitedNodes, coord.row, coord.col) >= 0){
                if(visitedNodes[idxFromCoord(visitedNodes, coord.row, coord.col)].distance === currNode.distance - 1){
                    currNode = visitedNodes[idxFromCoord(visitedNodes, coord.row, coord.col)]
                }
            }
        })
    }
    console.log(shortestPath)
    return shortestPath
}