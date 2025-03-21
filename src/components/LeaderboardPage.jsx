import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import axios from "axios";

const API_TRENDING_URL = "https://api.giphy.com/v1/gifs/trending";
const API_KEY = "etJBommWuqmOKuAg4sjVwhAkEnaBBE11";

const LeaderboardPage = () => {
  const [trendingGifs, setTrendingGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    fetchTrendingGifs();
  }, [offset]);

  const fetchTrendingGifs = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_TRENDING_URL}?api_key=${API_KEY}&limit=15&offset=${offset}`);
      const newGifs = response.data.data;
      setTrendingGifs((prev) => [...prev, ...newGifs]);
      if (newGifs.length < 15) setHasMore(false);
    } catch (error) {
      console.error("Error fetching trending GIFs:", error);
      setHasMore(false);
    }
    setLoading(false);
  };

  const lastGifRef = useCallback((node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setOffset((prevOffset) => prevOffset + 15);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <Link to="/" className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <FaArrowAltCircleLeft /> Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">🔥 Trending GIFs Leaderboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingGifs.map((gif, index) => (
          <div key={gif.id} ref={index === trendingGifs.length - 1 ? lastGifRef : null} className="bg-white shadow-md rounded-lg p-4">
            <img src={gif.images.fixed_height.url} className="rounded-lg w-full" alt={gif.title} />
            <p className="mt-2 text-gray-700 text-sm">🔥 Rank: {index + 1}</p>
            <p className="text-gray-500 text-xs">{gif.title || "No Title"}</p>
            <p className="text-gray-600 text-xs">📅 Added: {gif.import_datetime.split(" ")[0]}</p>
            <p className="text-gray-600 text-xs">📈 Trending Since: {gif.trending_datetime !== "0000-00-00 00:00:00" ? gif.trending_datetime.split(" ")[0] : "Not Trending Recently"}</p>
          </div>
        ))}
      </div>

      {loading && <p className="text-center text-gray-600 mt-4">Loading more GIFs...</p>}
    </div>
  );
};

export default LeaderboardPage;
