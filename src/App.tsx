// import "./App.css";
import { useState } from "react";
import { ModelViewer } from "./components/ModelViewer";

function App() {
  const [rotation, setRotation] = useState(0);

  const handleRotationChanged = (event: any) => {
    console.log("new rotation", parseFloat(event.target.value));
    setRotation(parseFloat(event.target.value));
  };

  const randomiseNeedle = () => {
    for (let x = 0; (x += 0.1); x < 0.3) {
      setRotation(x);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <ModelViewer needleRotation={rotation} />
        <input type="text" onChange={handleRotationChanged} />
        {/* <button type="button" onClick={randomiseNeedle}>
          Start
        </button> */}
      </header>
    </div>
  );
}

export default App;
