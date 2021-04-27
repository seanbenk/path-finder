import { useContext } from  'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './Tutorial.css'
import tutorialGoImg from '../images/tutorial/tutorial-go.png'
import tutorialDrawing from '../images/tutorial/tutorial-drawing.png'
import tutorialMazeGen from '../images/tutorial/tutorial-maze-gen.png'
import tutorialResetGrid from '../images/tutorial/tutorial-reset-grid.png'
import tutorialModes from '../images/tutorial/tutorial-modes.png'

export default function Tutorial(){

    const { setShowTutorial } = useContext(PathFinderContext)

    function hideTutorial(){
        setShowTutorial(false)
    }

    return (
        <section className="tutorial-section">
            <div className='tutorial-wrapper'>
                <span className="material-icons close-icon" onClick={hideTutorial}>close</span>
                    <Carousel showStatus={false} showThumbs={false} autoPlay={true} interval="8000" infiniteLoop={true}>
                        <div className="carousel-item"><img src={tutorialGoImg} alt=""/></div>
                        <div className="carousel-item"><img src={tutorialDrawing} alt=""/></div>
                        <div className="carousel-item"><img src={tutorialMazeGen} alt=""/></div>
                        <div className="carousel-item"><img src={tutorialResetGrid} alt=""/></div>
                        <div className="carousel-item"><img src={tutorialModes} alt=""/></div>
                    </Carousel>
            </div>
        </section>
    )
}