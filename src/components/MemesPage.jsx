/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaHeart, FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_KEY = "1OtyR1Ym6hgoK5JfGWyTQ85h1FhsWxUi";
const API_MEMES_URL = `https://api.giphy.com/v1/gifs/search?q=memes&api_key=${API_KEY}&limit=20`;

const MemesPage = () => {
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);

  useEffect(() => {
    fetchMemes();
  }, [page]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchMemes = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_MEMES_URL}&offset=${(page - 1) * 20}`);
      setMemes((prev) => [...prev, ...response.data.data]);
    } catch (error) {
      console.error("Error fetching meme GIFs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
      setPage((prev) => prev + 1);
    }
  };

  const downloadGif = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "meme_gif.gif";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading GIF:", error);
    }
  };

  const toggleFavorite = (gif) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === gif.id);
      return isFavorited ? prev.filter((fav) => fav.id !== gif.id) : [...prev, gif];
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">🤣 Memes GIFs</h1>
      <Link to="/" className="mb-4 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <FaArrowAltCircleLeft /> Homepage
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {memes.map((gif) => (
          <div key={gif.id} className="relative group">
            <img src={gif.images.fixed_height.url} alt={gif.title} className="rounded-lg shadow-lg w-full" />
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toggleFavorite(gif)} className={`p-2 rounded-lg ${favorites.some((fav) => fav.id === gif.id) ? "bg-red-500" : "bg-gray-700"} text-white`}>
                <FaHeart />
              </button>
              <button onClick={() => downloadGif(gif.images.original.url)} className="p-2 bg-blue-500 text-white rounded-lg">
                <FaDownload />
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="text-center mt-4 text-gray-400">Loading more memes...</p>}
    </div>
  );
};

export default MemesPage;
