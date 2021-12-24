import './App.css';
import Intro from './Components/Intro/Intro';
import Demo from './Components/Demo/Demo'
import COlorizer from './Components/Colorizer/Colorizer';
function App() {
  return (
    <div className="App">
        <Intro></Intro>
        <Demo></Demo>
        <COlorizer></COlorizer>
    </div>
  );
}

export default App;
