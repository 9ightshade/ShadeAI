/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SendIcon } from "lucide-react";
import { languageNames } from "./data";

const Summarizer = async (text: string) => {
  //summarization
  return { summary: text.substring(0, Math.floor(text.length / 3)) + "..." };
};

// Message type definition
interface Message {
  id: number;
  text: string;
  timestamp: string;
  detectedLanguage: string | null;
  summary: string | null;
  translation: string | null;
}

const TextInterface = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [language, setLanguage] = useState("en");
  const [isSummarized, setIsSummarized] = useState(false);
  const [summarizer, setSummarizer] = useState(null);
  const [translator, setTranslator] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setShowSummary(true); // Show summary after a delay
    }, 500); // Adjust delay as needed
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Create new message
    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      detectedLanguage: null,
      summary: null,
      translation: null,
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();

    const canDetect = languageDetectorCapabilities["available"];

    let detector;
    // Detect language
    if (canDetect === "readily") {
      console.log("// The language detector can immediately be used.");
      detector = await self.ai.languageDetector.create();
      try {
        const language = await detector.detect(inputText);
        let detectResponse;
        // function to get highest confidence count
        function getHighestConfidence(objects: any[]) {
          return objects.reduce(
            (
              highest: { confidence: number },
              current: { confidence: number }
            ) => {
              return current.confidence > highest.confidence
                ? (detectResponse = current)
                : (detectResponse = highest);
            }
          );
        }

        getHighestConfidence(language);

        updateMessage(newMessage.id, {
          detectedLanguage: detectResponse
            ? detectResponse["detectedLanguage"]
            : selectedLanguage,
        });
      } catch (error) {
        console.error("Language detection failed:", error);
      }
    }
  };

  const handleSummarize = async (messageId: number) => {
    if ("ai" in self && "summarizer" in self.ai) {
      console.log(" // The Summarizer API is supported.");
    }
    const message = messages.find((msg) => msg.id === messageId);
    const available = await self.ai.summarizer.capabilities();
    let summarizer;
    console.log(available);

    const options = {
      sharedContext: message?.text,
      type: "key-points",
      format: "markdown",
      length: "medium",
    };

    if (!message) return;

    try {
      const { summary } = await Summarizer(message.text);
      updateMessage(messageId, { summary });
    } catch (error) {
      console.error("Summarization failed:", error);
    }

    // if (available === "no") {
    //   console.log(" // The Summarizer API isn't usable.");

    // return;
    // }
    // if (available === "readily") {
    //   console.log(" // The Summarizer API can be used immediately .");

    //   summarizer = await self.ai.summarizer.create(options);
    // } else {
    //   console.log(
    //     "// The Summarizer API can be used after the model is downloaded."
    //   );
    // summarizer = await self.ai.summarizer.create(options);
    // summarizer.addEventListener("downloadprogress", (e) => {
    //   console.log(e.loaded, e.total);
    // });
    // await summarizer.ready;
  };

  const handleTranslate = async (messageId: number) => {
    // Check if 'self' is defined
    if (typeof self === "undefined") {
      console.error("// 'self' is not defined in this environment.");
      return;
    }

    // Check if 'ai' exists on 'self'
    if (!("ai" in self)) {
      console.error("// 'ai' property does not exist on 'self'.");
      return;
    }

    // Check if 'translator' exists on 'self.ai'
    if (!("translator" in self.ai)) {
      console.error("// 'translator' property does not exist on 'self.ai'.");
      return;
    }

    console.log("// The Translator API is supported.");

    // Proceed with translation logic
    const message = messages.find((msg) => msg.id === messageId);

    if (message) {
      try {
        const translatedMessage = await self.ai.translator.translate(
          message.text
        );
        console.log("// Translated Message:", translatedMessage);
        return translatedMessage;
      } catch (error) {
        console.error("// Translation error:", error);
      }
    } else {
      console.warn("// Message not found for ID:", messageId);
    }
  };

  const updateMessage = (messageId: number, updates: Partial<Message>) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Heading */}
      <motion.h1
        className="text-2xl text-center font-light text-purple-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        onAnimationComplete={handleAnimationComplete}>
        Shade AI
      </motion.h1>

      {/* Animated Subheading */}
      {showSummary && (
        <motion.p
          className="text-sm text-center text-purple-500 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}>
          Detect, Translate and Summarize
        </motion.p>
      )}

      <main className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-2 no-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col max-w-[85%] ml-auto animate-fade-in">
              <div className="flex items-end justify-end mb-1">
                <span className="text-xs text-gray-400 mr-2">
                  {message.timestamp}
                </span>
                <div className="bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-2xl rounded-tr-none shadow-sm">
                  <p className="text-gray-800 break-words">{message.text}</p>
                </div>
              </div>

              {message.detectedLanguage && (
                <div className="text-xs text-gray-500 ml-auto mr-2 mb-1">
                  Detected:{" "}
                  {(languageNames as any)[message.detectedLanguage] ||
                    message.detectedLanguage}
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-end mb-2">
                {message.detectedLanguage === "en" &&
                  message.text.length > 150 &&
                  !message.summary && (
                    <button
                      className="bg-white bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90 text-purple-700 text-xs px-3 py-1 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      onClick={() => handleSummarize(message.id)}
                      aria-label="Summarize text">
                      Summarize
                    </button>
                  )}

                <div className="flex items-center gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    aria-label="Select target language"
                    className="text-xs bg-white bg-opacity-70 backdrop-blur-sm border-none rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400 text-purple-700 shadow-sm">
                    {Object.entries(languageNames).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-white bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90 text-purple-700 text-xs px-3 py-1 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    onClick={() => handleTranslate(message.id)}
                    aria-label={`Translate to ${
                      (languageNames as any)[selectedLanguage]
                    }`}>
                    Translate
                  </button>
                </div>
              </div>

              {message.summary && (
                <div className="max-w-full ml-auto mr-2 mt-1 mb-3 p-3 bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-sm border-l-2 border-green-400">
                  <h4 className="text-xs font-medium text-green-700 mb-1">
                    Summary:
                  </h4>
                  <p className="text-sm text-gray-700">{message.summary}</p>
                </div>
              )}

              {message.translation && (
                <div className="max-w-full ml-auto mr-2 mt-1 mb-3 p-3 bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-sm border-l-2 border-purple-400">
                  <h4 className="text-xs font-medium text-purple-700 mb-1">
                    Translation ({(languageNames as any)[selectedLanguage]}):
                  </h4>
                  <p className="text-sm text-gray-700">{message.translation}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="relative border border-purple-600 rounded-2xl">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Ask me anything that's on your mind..."
            aria-label="Input text"
            className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-full pl-4 pr-12 py-3 shadow-sm focus:outline-none text-gray-700 placeholder-gray-400 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full transition"
            onClick={handleSendMessage}
            aria-label="Send message">
            <SendIcon size={18} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default TextInterface;
