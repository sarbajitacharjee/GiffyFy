/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = "https://api.giphy.com/v1/gifs/trending";
const API_KEY = "1OtyR1Ym6hgoK5JfGWyTQ85h1FhsWxUi";

const Trending = ({ darkMode }) => {
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGifs();
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
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&limit=10&offset=${offset}`);
      setGifs(response.data.data);
      setOffset(10);
    } catch (error) {
      console.error("Error fetching GIFs", error);
    }
    setLoading(false);
  };

  const fetchMoreGifs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?api_key=${API_KEY}&limit=10&offset=${offset}`);
      setGifs((prevGifs) => [...prevGifs, ...response.data.data]);
      setOffset(offset + 10);
    } catch (error) {
      console.error("Error fetching more GIFs", error);
    }
    setLoading(false);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
      <h1 className="text-3xl font-bold mb-6">🔥 Trending GIFs</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gifs.map((gif) => (
          <motion.img 
            key={gif.id} 
            src={gif.images.fixed_height.url} 
            alt={gif.title} 
            className="rounded-lg shadow-lg"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      {loading && <p className="mt-4 text-gray-500">Loading more GIFs...</p>}
    </div>
  );
};

export default Trending;
