/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { SendIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {languageNames} from "./data"
// Mock APIs for development - replace with actual Chrome AI APIs in production
const mockLanguageDetector = async (text: string) => {
  if (!("translation" in self) || !("createDetector" in self.translation)) {
    console.log(".not-supported-message");
    return;
  }
};

//declaring message type
interface Message {
  id: number;
  text: string;
  timestamp: string;
  detectedLanguage: string | null;
  summary: string | null;
  translation: string | null;
}

const ChatInterface = () => {
  const [inputText, setInputText] = useState<string>("");
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    // console.log(inputText);
  };
  const handleClear = () => {
    setInputText("");
  };
  // Log the inputText whenever it changes
  useEffect(() => {
  }, [inputText]);

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


    if ("ai" in self && "languageDetector" in self.ai) {
      // The Language Detector API is available.
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities["available"];

      let detector;
      if (canDetect === "no") {
        console.log("// The language detector isn't usable");
        return;
      }
      if (canDetect === "readily") {
        console.log("// The language detector can immediately be used.");

        detector = await self.ai.languageDetector.create();
        const language =  await detector.detect(inputText);
        console.log(language);
        
        // updateMessage(newMessage.id, { detectedLanguage: language });
        // for (const result of results) {
          // Show the full list of potential languages with their likelihood, ranked
          // from most likely to least likely. In practice, one would pick the top
          // language(s) that cross a high enough threshold.
          // console.log(result.detectedLanguage, result.confidence);
        // }
        
      } else {
        console.log(
          "// The language detector can be used after model download."
        );

        detector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
    } else {
      console.log("not working..");
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
    <div className="p-8 relative h-screen">
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
                  {(languageNames)[message.detectedLanguage] ||
                    message.detectedLanguage}
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-end mb-2">
                {message.detectedLanguage === "en" &&
                  message.text.length > 150 &&
                  !message.summary && (
                    <button
                      className="bg-white bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90 text-purple-700 text-xs px-3 py-1 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      // onClick={() => handleSummarize(message.id)}
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
                    // onClick={() => handleTranslate(message.id)}
                    // aria-label={`Translate to ${
                    //   (languageNames as any)[selectedLanguage]
                    // }`}
                    >
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
                    Translation ({(languageNames)[selectedLanguage]}):
                  </h4>
                  <p className="text-sm text-gray-700">{message.translation}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>


      <div className="absolute bottom-8 left-32 right-32 border border-purple-600 rounded-2xl">
        
          <input
            type="text"
            placeholder="Ask me anything that's on your mind..."
            aria-label="Input text"
            className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-full pl-4 pr-12 py-3 shadow-sm focus:outline-none text-gray-700 placeholder-gray-400 outline-none"
            value={inputText}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full transition"
            aria-label="Send message"
            onClick={handleSendMessage}>
            <SendIcon size={18} />
          </button>
      
      </div>
      </main>
    </div>
  
);
};

export default ChatInterface;
