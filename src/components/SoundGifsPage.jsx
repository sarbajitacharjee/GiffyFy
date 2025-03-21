/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaDownload, FaShareAlt, FaArrowAltCircleLeft } from "react-icons/fa";

const API_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "etJBommWuqmOKuAg4sjVwhAkEnaBBE11";

const categories = ["Funny", "Music", "Memes", "Cartoons"];


const SoundGifsPage = ({ darkMode }) => {
  const [gifs, setGifs] = useState([]);
  const [playingGif, setPlayingGif] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [downloads, setDownloads] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Funny");

  useEffect(() => {
    fetchSoundGifs(selectedCategory);
    loadFavorites();
  }, [selectedCategory]);

  const fetchSoundGifs = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&q=${category}&limit=10`);
      setGifs(response.data.data.filter((gif) => gif.images.original_mp4));
    } catch (error) {
      console.error("Error fetching sound GIFs", error);
    }
    setLoading(false);
  };

  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  };

  const toggleFavorite = (gif) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === gif.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== gif.id);
    } else {
      updatedFavorites = [...favorites, gif];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const downloadGif = async (gif) => {
    try {
      const response = await fetch(gif.images.original_mp4.mp4);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sound_gif.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloads((prev) => ({
        ...prev,
        [gif.id]: (prev[gif.id] || 0) + 1,
      }));
    } catch (error) {
      console.error("Error downloading GIF:", error);
    }
  };

  const shareGif = async (gif) => {
    const gifUrl = gif.images.original_mp4.mp4;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this cool GIF with sound!",
          text: "Look at this amazing sound GIF!",
          url: gifUrl,
        });
      } catch (error) {
        console.error("Error sharing GIF:", error);
      }
    } else {
      navigator.clipboard.writeText(gifUrl);
      alert("GIF link copied to clipboard!");
    }
  };

  const togglePlay = (gifId) => {
    setPlayingGif(playingGif === gifId ? null : gifId);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
      <h1 className="text-3xl text-center font-bold mb-6">GIFs with Sound 🔊</h1>
      <Link to="/" className="mb-4 inline-flex items-center gap-2 justify-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <FaArrowAltCircleLeft /> Homepage
      </Link>


      <div className="mb-6">
        <label className="block text-lg font-medium">Select Category:</label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center text-gray-500">Loading {selectedCategory} GIFs...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifs.length > 0 ? (
          gifs.map((gif) => (
            <div key={gif.id} className="relative group rounded-lg shadow-lg overflow-hidden">
              <motion.video
                src={gif.images.original_mp4.mp4}
                className="w-full h-full object-cover rounded-lg"
                autoPlay={playingGif === gif.id}
                loop
                controls
                muted={playingGif !== gif.id}
              />

              <button
                onClick={() => togglePlay(gif.id)}
                className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full text-lg"
              >
                {playingGif === gif.id ? <FaPause /> : <FaPlay />}
              </button>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleFavorite(gif)} className="text-red-500 text-xl">
                  {favorites.some((fav) => fav.id === gif.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button onClick={() => downloadGif(gif)} className="text-blue-500 text-xl">
                  <FaDownload />
                </button>
                <button onClick={() => shareGif(gif)} className="text-green-500 text-xl">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No {selectedCategory} GIFs found!</p>
        )}
      </div>
    </div>
  );
};

export default SoundGifsPage;
