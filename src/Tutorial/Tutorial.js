import { useContext } from  'react'
import { PathFinderContext } from '../PathFinderContext/PathFinderContext.js'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './Tutorial.css'

export default function Tutorial(){

    const { showTutorial, setShowTutorial } = useContext(PathFinderContext)

    function hideTutorial(){
        setShowTutorial(false)
    }

    return (
        <section className="tutorial-section">
            <div className='tutorial-wrapper'>
                <span class="material-icons close-icon" onClick={hideTutorial}>close</span>
                <div className="carousel-wrapper">
                    <Carousel showStatus={false}>
                        <div className="carousel-item">page 1</div>
                        <div className="carousel-item">page 2</div>
                        <div className="carousel-item">page 3</div>
                        <div className="carousel-item">page 4</div>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}