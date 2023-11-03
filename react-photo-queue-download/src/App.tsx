import PhotoQueue from "./PhotoQueue";

function App() {
  return (
    <div className="w-screen h-screen p-2 flex flex-col items-center overflow-hidden">
      <h1 className="text-center font-bold text-2xl m-2">React Photo Queue</h1>
      <PhotoQueue></PhotoQueue>
    </div>
  );
}

export default App;
