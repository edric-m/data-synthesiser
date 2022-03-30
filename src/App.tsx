// import "./App.css";
import { useState } from "react";
import { ModelViewer } from "./components/ModelViewer";

function App() {
  const [rotation, setRotation] = useState(0);

  const handleRotationChanged = (event: any) => {
    console.log("new rotation", parseFloat(event.target.value));
    setRotation(parseFloat(event.target.value));
  };

  // const randomiseNeedle = () => {
  //   for (let x = 0; (x += 0.1); x < 0.3) {
  //     setRotation(x);
  //   }
  // };

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

// const takeScreenshotCanvas = async (stream: MediaStream): Promise<HTMLCanvasElement> => {
//   const video = document.createElement('video');
//   const result = await new Promise<HTMLCanvasElement>((resolve) => {
//     video.addEventListener('loadedmetadata', () => {
//       video.play();
//       video.pause();
//       const canvas = document.createElement('canvas');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const context = canvas.getContext('2d');
//       context!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
//       resolve(canvas);
//     });
//     video.srcObject = stream;
//   });

//   // stream!.getTracks().forEach(function (track) {
//   //   track.stop();
//   // });

//   if (result == null) {
//     throw new Error('Cannot take canvas screenshot');
//   }

//   return new Promise<HTMLCanvasElement>((resolve, reject) => {
//     if (result) {
//       resolve(result);
//     } else {
//       reject();
//     }
//   });
// };
