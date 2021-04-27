/* eslint no-unreachable: off */
import './Node.css'
import { useContext } from 'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import blueHouse from '../images/blue-house.png'
import redHouse from '../images/red-house.png'
import tree1 from '../images/tree-1.png'
import tree2 from '../images/tree-2.png'
import fireHydrant from '../images/fire-hydrant.png'
import straightRoadHorizontal from  '../images/straight-road-horizontal.png'
import straightRoadVertical from  '../images/straight-road-vertical.png'
import cornerRoadLeftDown from '../images/corner-road-left-down.png'
import cornerRoadLeftUp from '../images/corner-road-left-up.png'
import cornerRoadRightDown from '../images/corner-road-right-down.png'
import cornerRoadRightUp from '../images/corner-road-right-up.png'
import tIntRoadTop from  '../images/t-int-road-top.png'
import tIntRoadLeft from  '../images/t-int-road-left.png'
import tIntRoadRight from  '../images/t-int-road-right.png'
import tIntRoadBottom from  '../images/t-int-road-bottom.png'
import singleRoadTop from '../images/single-road-top.png'
import singleRoadRight from '../images/single-road-right.png'
import singleRoadBottom from '../images/single-road-bottom.png'
import singleRoadLeft from '../images/single-road-left.png'
import allRoad from  '../images/all-road.png'
import car from  '../images/car.png'

export default function Node(props){

    const { isStartPoint, isEndPoint, isWall, isVisited, isPath, row, col, roadType, isCar } = props.data

    const { isMouseDown, updateNodes, selectedNode, nodeImages, isGridMode } = useContext(PathFinderContext)

    function getNodeClasses(){
        return `node${isStartPoint?' start-node':''}${isEndPoint?' end-node':''}${isWall?' wall-node':''}${isVisited?' visited-node':''}${isPath?' path-node':''}`
    }
    
    function mouseEnter(e){
        if(isMouseDown){
            updateNodes(row, col, selectedNode)
        }
    }

    function getStyle(){
        if(!isGridMode){
            if(isStartPoint){
                return {backgroundImage: `url(${blueHouse})`,
                        backgroundColor: '#7DD669'}
            } else if(isEndPoint){
                return {backgroundImage: `url(${redHouse})`,
                        backgroundColor: '#7DD669'}
            } else if(isWall){
                switch(nodeImages[row][col]){
                    case 'tree1': 
                    return {backgroundImage: `url(${tree1})`}
                    case 'tree2': 
                    return {backgroundImage: `url(${tree2})`}
                    case 'fireHydrant': 
                    return {backgroundImage: `url(${fireHydrant})`}
                    default: return {}
                }
            } else if(isCar){
                return {backgroundImage: `url(${car})`,
                        backgroundColor: '#474747'}
            }
            return {backgroundImage: `url(${getRoadImage()})`}
        }
    }

    function getRoadImage(){
        switch(roadType){
            case 'straight-road-vertical': return straightRoadVertical
            case 'straight-road-horizontal': return straightRoadHorizontal
            break;
            case 'corner-road-left-down': return cornerRoadLeftDown
            break
            case 'corner-road-left-up': return cornerRoadLeftUp
            break
            case 'corner-road-right-down': return cornerRoadRightDown
            break
            case 'corner-road-right-up': return cornerRoadRightUp
            break
            case 't-int-road-top': return tIntRoadTop
            break;
            case 't-int-road-right': return tIntRoadRight
            break;
            case 't-int-road-bottom': return tIntRoadBottom
            break;
            case 't-int-road-left': return tIntRoadLeft
            break;
            case 'single-road-top': return singleRoadTop
            break;
            case 'single-road-right': return singleRoadRight
            break;
            case 'single-road-bottom': return singleRoadBottom
            break;
            case 'single-road-left': return singleRoadLeft
            break;
            case 'all-road': return allRoad
            default: return allRoad
        }
    }

    return (
            <div 
                className={getNodeClasses()} data-row={row} data-col={col} onMouseEnter={mouseEnter} 
                style={getStyle()}>
            </div>
    )
}