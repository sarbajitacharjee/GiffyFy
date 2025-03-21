/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart, FaDownload } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const API_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "1OtyR1Ym6hgoK5JfGWyTQ85h1FhsWxUi";

const CategoryPage = ({ category, title, darkMode }) => {
  const [gifs, setGifs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGifs();
    loadFavorites();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100) {
        fetchMoreGifs();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  const fetchGifs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&q=${category}&limit=10&offset=${offset}`);
      setGifs(response.data.data);
      setOffset(offset + 10);
    } catch (error) {
      console.error("Error fetching GIFs", error);
    }
    setLoading(false);
  };

  const fetchMoreGifs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&q=${category}&limit=10&offset=${offset}`);
      setGifs((prevGifs) => [...prevGifs, ...response.data.data]);
      setOffset(offset + 10);
    } catch (error) {
      console.error("Error fetching more GIFs", error);
    }
    setLoading(false);
  };

  // Load favorites from localStorage
  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  };

  // Toggle favorite status
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

  // Download GIF
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
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
      
      <h1 className="text-3xl text-center font-bold mb-6">{title}</h1>
      {/* Back to Homepage Button */}
      <Link to="/" className="mb-4 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <FaArrowAltCircleLeft/> Homepage
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gifs.length > 0 ? (
          gifs.map((gif) => (
            <div key={gif.id} className="relative group">
              <motion.img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="rounded-lg shadow-lg w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* Buttons (Favorite & Download) */}
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
          <p className="text-center text-gray-500">No GIFs found!</p>
        )}
      </div>
      {loading && <p className="mt-4 text-gray-500">Loading more GIFs...</p>}
    </div>
  );
};

export default CategoryPage;
