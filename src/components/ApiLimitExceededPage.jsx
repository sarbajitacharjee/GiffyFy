/* eslint-disable no-unused-vars */
import React from "react";
// import { Link } from "react-router-dom";

const ApiLimitExceededPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">🚨 API Limit Reached!</h1>
      <p className="text-lg mb-6 text-center">
        You've exceeded the hourly API usage limit. Please wait for it to reset or try again later. 
        or Check our Gif categories
      </p>
      <a href="/"
        
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-lg"
      >
        Refresh
      </a>
    </div>
  );
};

export default ApiLimitExceededPage;
