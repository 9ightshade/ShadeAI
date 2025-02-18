"use client";
import React from "react";
import { SendIcon } from "lucide-react";
import { motion } from "framer-motion";
const ChatInterface = () => {
  return (
    <div className="p-8 relative h-screen">
      {/* Animated Heading */}
      <motion.h1
        className="text-2xl text-center font-light text-purple-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}>
        Shade AI
      </motion.h1>

      {/* Animated Subheading */}
      <motion.p
        className="text-sm text-center text-purple-500 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}>
        Ask our AI anything
      </motion.p>

      <div className="absolute bottom-8 left-32 right-32 border border-purple-600 rounded-2xl">
        <input
          type="text"
          placeholder="Ask me anything that's on your mind..."
          aria-label="Input text"
          className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-full pl-4 pr-12 py-3 shadow-sm focus:outline-none text-gray-700 placeholder-gray-400 outline-none"
        />
        <button
          className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full transition"
          aria-label="Send message">
          <SendIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
