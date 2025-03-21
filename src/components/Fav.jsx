import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaDownload, FaArrowAltCircleLeft } from "react-icons/fa";

const Fav = ({ darkMode }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((gif) => gif.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const downloadGif = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "favorite_gif.gif";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading GIF:", error);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen p-6`}>
      <h1 className="text-3xl font-bold mb-6">❤️ Favorite GIFs</h1>

      {/* Back to Homepage Button */}
      <Link to="/" className="mb-4 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <FaArrowAltCircleLeft /> Homepage
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.length > 0 ? (
          favorites.map((gif) => (
            <div key={gif.id} className="relative group">
              <img src={gif.images.fixed_height.url} alt={gif.title} className="rounded-lg shadow-lg w-full" />

              {/* Buttons: Remove & Download */}
              <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Download Button */}
                <button onClick={() => downloadGif(gif.images.original.url)} className="p-2 bg-blue-500 text-white rounded-lg">
                  <FaDownload />
                </button>

                {/* Remove Button */}
                <button onClick={() => removeFavorite(gif.id)} className="p-2 bg-red-500 text-white rounded-lg">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No favorites yet! ❤️</p>
        )}
      </div>
    </div>
  );
};

export default Fav;
