/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { FaDownload, FaHeart, FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_KEY = "1OtyR1Ym6hgoK5JfGWyTQ85h1FhsWxUi";

const CartoonsPage = () => {
  const [cartoons, setCartoons] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchCartoons(page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchCartoons = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?q=cartoons&api_key=${API_KEY}&limit=20&offset=${(page - 1) * 20}`
      );
      setCartoons((prev) => [...prev, ...response.data.data]);
    } catch (error) {
      console.error("Error fetching cartoon GIFs", error);
    }
    setLoading(false);
  };

  const downloadGif = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "cartoon_gif.gif";
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

  // Infinite Scroll Handler
  const observer = useRef();
  const lastGifRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">🎭 Cartoon GIFs</h1>
      <Link to="/" className="mb-4 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <FaArrowAltCircleLeft /> Homepage
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cartoons.length > 0 ? (
          cartoons.map((gif, index) => (
            <div key={gif.id} ref={index === cartoons.length - 1 ? lastGifRef : null} className="relative group">
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
          ))
        ) : (
          <p className="text-center text-gray-400">No cartoons found!</p>
        )}
      </div>
      {loading && <p className="text-center mt-4 text-gray-400">Loading more cartoons...</p>}
    </div>
  );
};

export default CartoonsPage;
