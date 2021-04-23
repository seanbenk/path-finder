import './App.css';
import PathFinderGrid from './PathFinderGrid/PathFinderGrid.js'
import { useContext } from 'react'
import { PathFinderContext } from './PathFinderContext/PathFinderContext.js'

function App() {

  const { setIsMouseDown } = useContext(PathFinderContext)

  function setMouseUp(){
    setIsMouseDown(false)
}

  return (
    <div className="App" onMouseUp={setMouseUp}>
      <PathFinderGrid/>
    </div>
  );
}

export default App;