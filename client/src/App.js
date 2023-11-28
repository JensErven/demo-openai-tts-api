import logo from "./logo.svg";
import "./App.css";
import { generateSpeech } from "./services/tts"; // Import the generateSpeech function
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function App() {
  const isDevelopment = true;
  const apiURL = isDevelopment
    ? "http://localhost:5000"
    : "https://videochat-backend.onrender.com";

  const options = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  const defaultOption = options[0];
  const [text, setText] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [loadingSpeech, setLoadingSpeech] = useState("");
  const [selectedVoiceModel, setSelectedVoiceModel] = useState(options[0]);
  const audioRef = useRef();
  // State to track the last audio file added
  const [lastAudioFile, setLastAudioFile] = useState(null);
  const handleTextChange = (e) => {
    const newText = e.target.value;
    newText.trim();
    setText(newText);
  };

  useEffect(() => {
    // Check when a new audio file is added
    if (audioFiles.length > 0) {
      // Set the last audio file
      setLastAudioFile(audioFiles[audioFiles.length - 1]);
    }
  }, [audioFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text === "") return;
    setLoadingSpeech(true);
    try {
      const response = await axios.post(
        `${apiURL}/generate-speech`,
        { text, selectedVoiceModel },
        {
          responseType: "arraybuffer", // Ensure response is treated as ArrayBuffer
        }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setLoadingSpeech(false);
      // Save audio URL to the array
      setAudioFiles((prevAudioFiles) => [...prevAudioFiles, audioUrl]);

      // Play audio
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setText("");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="App p-2">
      {" "}
      <Dropdown
        className="flex flex-row justify-end mb-4"
        options={options}
        onChange={(selectedOption) => {
          // Handle the selected option here

          setSelectedVoiceModel(selectedOption.value);
        }}
        value={defaultOption}
        placeholder="Select an option"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-stone-200 flex flex-col p-2 gap-2 rounded-md shadow-md"
      >
        <textarea
          className="p-2 max-h-40 rounded-md min-h-24"
          placeholder="What do you want me to say?"
          type="text"
          value={text}
          onChange={handleTextChange}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600  text-stone-100 py-2 rounded-md"
        >
          Generate Speech
        </button>
      </form>
      {loadingSpeech && (
        <div className="flex flex-row items-center justify-center my-8">
          <div className="bg-slate-600 animate-ping w-10 h-10 rounded-full"></div>
        </div>
      )}
      {lastAudioFile && (
        <div className="overflow-y-scroll h-fit bg-stone-200 my-4 rounded-md shadow-md">
          <p className="my-4 text-xl capitalize">generated audiofile</p>
          <div className="p-2">
            <audio
              autoPlay
              ref={audioRef}
              controls
              className="w-full rounded-md"
            >
              <source src={lastAudioFile} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      )}
      {audioFiles.length > 1 && (
        <>
          <hr className="bg-slate-200 w-full h-1 rounded-full my-4"></hr>
          <div className="overflow-y-scroll h-max-80 bg-stone-200 rounded-md shadow-md mb-10">
            <p className="my-4 text-xl capitalize">previous audiofiles</p>
            {audioFiles.map((audioUrl, index) => (
              <div key={index} className="p-2">
                <audio controls src={audioUrl} className="w-full rounded-md " />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
