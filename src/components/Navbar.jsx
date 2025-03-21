import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} p-4 flex justify-between`}>
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/funny" className="hover:underline">Funny</Link>
        <Link to="/anime" className="hover:underline">Anime</Link>
        <Link to="/sports" className="hover:underline">Sports</Link>
        <Link to="/favorites" className="hover:underline">Favorites</Link>
      </div>
      <button onClick={toggleDarkMode} className="bg-gray-600 text-white px-3 py-1 rounded">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
