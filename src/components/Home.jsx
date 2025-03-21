/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaDownload } from "react-icons/fa";
import ApiLimitExceed from "../components/ApiLimitExceededPage"; // Import your API limit exceeded component

const API_TRENDING_URL = "https://api.giphy.com/v1/gifs/trending";
const API_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "etJBommWuqmOKuAg4sjVwhAkEnaBBE11";

const Home = () => {
  const [gifs, setGifs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiLimitExceeded, setApiLimitExceeded] = useState(false);
  const observer = useRef(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setOffset(0);
      fetchTrendingGifs(true);
    }
  }, [searchTerm]);

  const fetchTrendingGifs = async (reset = false) => {
    if (loading || apiLimitExceeded) return;
    setLoading(true);

    try {
      const response = await axios.get(`${API_TRENDING_URL}?api_key=${API_KEY}&limit=10&offset=${offset}`);
      setGifs((prevGifs) => (reset ? response.data.data : [...prevGifs, ...response.data.data]));
      setOffset((prevOffset) => prevOffset + 10);
    } catch (error) {
      if (error.response?.status === 429) {
        setApiLimitExceeded(true);
      } else {
        console.error("Error fetching trending GIFs", error);
      }
    }
    setLoading(false);
  };

  const fetchSearchGifs = async (reset = false) => {
    if (loading || apiLimitExceeded) return;
    setLoading(true);

    try {
      const response = await axios.get(`${API_SEARCH_URL}?api_key=${API_KEY}&q=${searchTerm}&limit=10&offset=${offset}`);
      setGifs((prevGifs) => (reset ? response.data.data : [...prevGifs, ...response.data.data]));
      setOffset((prevOffset) => prevOffset + 10);
    } catch (error) {
      if (error.response?.status === 429) {
        setApiLimitExceeded(true);
      } else {
        console.error("Error fetching search GIFs", error);
      }
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
    setGifs([]);
    setApiLimitExceeded(false);
    if (e.target.value.trim()) {
      fetchSearchGifs(true);
    } else {
      fetchTrendingGifs(true);
    }
  };

  const lastGifRef = useCallback(
    (node) => {
      if (loading || apiLimitExceeded) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          searchTerm ? fetchSearchGifs() : fetchTrendingGifs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, searchTerm, apiLimitExceeded]
  );

  const toggleFavorite = (gif) => {
    const updatedFavorites = favorites.some((fav) => fav.id === gif.id)
      ? favorites.filter((fav) => fav.id !== gif.id)
      : [...favorites, gif];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const downloadGif = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "gif.gif";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading GIF:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-center mb-6">GIF Explorer 🎉</h1>

      <input
        type="text"
        placeholder="Search GIFs..."
        className="mb-4 px-4 py-2 border rounded-lg w-80 text-gray-900"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Link to="/favorites" className="mb-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
        View Favorites
      </Link>
      <Link to="/leaderboard" className="mb-4 px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600">
        🏆 Leaderboard
      </Link>

      {searchTerm === "" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Link to="/funny" className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600">😂 Funny</Link>
          <Link to="/sports" className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600">🏆 Sports</Link>
          <Link to="/anime" className="px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600">🎌 Anime</Link>
          <Link to="/SoundGifsPage" className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600">🔊 Sound Gifs</Link>
          <Link to="/CartoonsPage" className="px-4 py-2 bg-teal-500 rounded-lg hover:bg-teal-600">📺 Cartoons</Link>
          <Link to="/MemesPage" className="px-4 py-2 bg-rose-500 rounded-lg hover:bg-rose-600">🤣 Memes</Link>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">{searchTerm ? "🔍 Search Results" : "🔥 Trending GIFs"}</h1>

      {apiLimitExceeded ? (
        <ApiLimitExceed />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gifs.length > 0 ? (
            gifs.map((gif, index) => (
              <div key={gif.id} className="relative group" ref={index === gifs.length - 1 ? lastGifRef : null}>
                <motion.img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  className="rounded-lg shadow-lg w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleFavorite(gif)} className="text-red-500 text-xl">
                    {favorites.some((fav) => fav.id === gif.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button onClick={() => downloadGif(gif.images.original.url)} className="text-blue-500 text-xl">
                    <FaDownload />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No GIFs Found!</p>
          )}
        </div>
      )}

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  );
};

export default Home;
