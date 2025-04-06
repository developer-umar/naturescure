import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Herba = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatResponse = (text) => {
    const cleanText = text.replace(/\*+/g, "").trim();
    return cleanText.split("\n").map((line, i) => (
      <p key={i} className="mb-1">{line}</p>
    ));
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
      const res = await fetch("http://localhost:5000/api/chat", {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center p-4 md:p-6">
      <motion.div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col h-[80vh] overflow-hidden relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-center">Herba - Your AI Plant Guide</h2>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 text-lg font-medium">
              Ask me anything about plants!
            </p>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`p-4 rounded-xl max-w-[80%] font-medium text-lg shadow-md ${
                msg.sender === "user" ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-green-200 text-black"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <strong className="block mb-1">{msg.sender === "user" ? "You:" : "Herba:"}</strong>
              {formatResponse(msg.text)}
            </motion.div>
          ))}
          {loading && (
            <motion.div
              className="mr-auto p-4 bg-green-200 text-black rounded-xl max-w-[80%] font-medium text-lg shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <strong className="block mb-1">Herba:</strong>
              <span className="animate-pulse">Typing...</span>
            </motion.div>
          )}
          <div ref={chatEndRef}></div>

          {/* 🔥 Floating "Back to Input" Button (now at bottom) */}
       
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about plants..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-5 py-3 text-lg text-black bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm disabled:bg-gray-200"
              disabled={loading}
            />
            <motion.button
              onClick={sendMessage}
              className={`px-6 py-3 text-lg font-medium rounded-full shadow-md transition-all duration-200 
                ${loading ? " cursor-not-allowed" : "bg-gray-400 text-black"}
              `}
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