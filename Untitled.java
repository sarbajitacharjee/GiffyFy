import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPlay, FaPause } from "react-icons/fa";

const API_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "1OtyR1Ym6hgoK5JfGWyTQ85h1FhsWxUi";

const SoundGifsPage = ({ darkMode }) => {
  const [gifs, setGifs] = useState([]);
  const [playingGif, setPlayingGif] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSoundGifs();
  }, []);

  const fetchSoundGifs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&q=sound&limit=10`);
      setGifs(response.data.data.filter((gif) => gif.images.original_mp4)); // Only show GIFs with sound
    } catch (error) {
      console.error("Error fetching sound GIFs", error);
    }
    setLoading(false);
  };

  const togglePlay = (gifId) => {
    setPlayingGif(playingGif === gifId ? null : gifId);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
      
      {/* Back to Homepage Button */}
      <Link to="/" className="mb-4 inline-block px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        ⬅️ Back to Homepage
      </Link>

      <h1 className="text-3xl font-bold mb-6">GIFs with Sound 🔊</h1>
      
      {loading && <p className="text-center text-gray-500">Loading GIFs with sound...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifs.length > 0 ? (
          gifs.map((gif) => (
            <div key={gif.id} className="relative group rounded-lg shadow-lg overflow-hidden">
              <motion.video
                src={gif.images.original_mp4.mp4}
                className="w-full h-full object-cover rounded-lg"
                autoPlay={playingGif === gif.id}
                loop
                muted={playingGif !== gif.id}
              />
              {/* Play/Pause Button */}
              <button
                onClick={() => togglePlay(gif.id)}
                className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full text-lg"
              >
                {playingGif === gif.id ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No GIFs with sound found!</p>
        )}
      </div>
    </div>
  );
};

export default SoundGifsPage;
