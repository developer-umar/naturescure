import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react"; // Icons for audio toggle

const Herba = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Audio toggle state
  const [voices, setVoices] = useState([]); // Voices store karne ke liye
  const [scale, setScale] = useState(1.2); // Dynamic scale state
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Voices preload karna jab component mount ho
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices; // Voices load hone pe update
    loadVoices();
  }, []);

  // Chat scroll karna jab naya message aaye
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Audio play karna jab bot message aaye aur audio enabled ho
  useEffect(() => {
    if (isAudioEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot") {
        speak(lastMessage.text);
      }
    }
  }, [messages, isAudioEnabled]);

  // Window size ke hisaab se scale adjust karna
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(1); // Chhoti screen (mobile) pe scale 100%
      } else if (width < 1024) {
        setScale(1.1); // Medium screen (tablet) pe 110%
      } else {
        setScale(1.2); // Badi screen (desktop) pe 120%
      }
    };

    updateScale(); // Initial call
    window.addEventListener("resize", updateScale); // Resize pe update
    return () => window.removeEventListener("resize", updateScale); // Cleanup
  }, []);

  const formatResponse = (text) => {
    const cleanText = text.replace(/\*+/g, "").trim();
    return cleanText.split("\n").map((line, i) => (
      <p key={i} className="mb-1">{line}</p>
    ));
  };

  // Speech function with female voice
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      // Female voice select karna
      const femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.includes("Google US English") // Aksar female voice hoti hai
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.volume = 1.0; // Volume
      utterance.rate = 1.0;  // Speed
      utterance.pitch = 1.2;  // Thodi high pitch ladki jaisi awaaz ke liye
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);

    try {
      const res = await fetch("https://naturescurezone.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = {
        text: data.reply
          ? data.reply.length > 800
            ? data.reply.slice(0, 800) + "..."
            : data.reply
          : "Koi response nahi mila!",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error fetching chatbot response:", error);
      setMessages((prev) => [...prev, { text: "❌ Error! Try again.", sender: "bot" }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  const scrollToInput = () => {
    inputRef.current?.focus();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => !prev);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop current speech if toggling off
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        className="w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col h-[80vh] sm:h-[85vh] overflow-hidden relative"
        initial={{ opacity: 0, y: 50, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: scale }} // Dynamic scale use kiya
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: "center" }} // Center se scale hoga
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-3 sm:p-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Herba - Your AI Plant Guide
          </h2>
          <button
            onClick={toggleAudio}
            className="p-2 text-white hover:bg-green-700 rounded-full transition-colors"
            aria-label={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg font-medium">
              Ask me anything about plants!
            </p>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`p-3 sm:p-4 rounded-xl max-w-[85%] sm:max-w-[80%] font-medium text-sm sm:text-base md:text-lg shadow-md ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-green-200 text-black"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <strong className="block mb-1">
                {msg.sender === "user" ? "You:" : "Herba:"}
              </strong>
              {formatResponse(msg.text)}
            </motion.div>
          ))}
          {loading && (
            <motion.div
              className="mr-auto p-3 sm:p-4 bg-green-200 text-black rounded-xl max-w-[85%] sm:max-w-[80%] font-medium text-sm sm:text-base md:text-lg shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <strong className="block mb-1">Herba:</strong>
              <span className="animate-pulse">Typing...</span>
            </motion.div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about plants..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full sm:flex-1 px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base md:text-lg text-black bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm disabled:bg-gray-200"
              disabled={loading}
            />
            <motion.button
              onClick={sendMessage}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-medium rounded-full shadow-md transition-all duration-200 ${
                loading ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
              }`}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Herba;