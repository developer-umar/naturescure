import React, { useState } from "react";
import { motion } from "framer-motion";

const quizData = [
  {
    question: "Which herb is known as the 'Queen of Herbs'?",
    options: ["Tulsi", "Brahmi", "Neem", "Ashwagandha"],
    answer: "Tulsi",
    explanation: "Tulsi is revered in Ayurveda for its therapeutic properties."
  },
  {
    question: "Which herb is widely used for its anti-inflammatory properties?",
    options: ["Aloe Vera", "Amla", "Arjuna", "Calendula"],
    answer: "Calendula",
    explanation: "Calendula has potent anti-inflammatory and healing properties."
  },
  {
    question: "Which herb is traditionally used to boost memory and concentration?",
    options: ["Brahmi", "Neem", "Tulsi", "Sandalwood"],
    answer: "Brahmi",
    explanation: "Brahmi is known for its cognitive benefits."
  },
  {
    question: "Which herb is often used to reduce stress and anxiety?",
    options: ["Ashwagandha", "Aloe Vera", "Amla", "Rose"],
    answer: "Ashwagandha",
    explanation: "Ashwagandha is an adaptogen that helps in reducing stress."
  },
  {
    question: "Which herb is a rich source of Vitamin C and is used to boost immunity?",
    options: ["Amla", "Calendula", "Tulsi", "Neem"],
    answer: "Amla",
    explanation: "Amla, or Indian gooseberry, is high in Vitamin C."
  }
];

const HerbalQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  // answered = true means answer has been submitted and feedback shown.
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (option) => {
    if (!answered) {
      setSelectedOption(option);
    }
  };

  const handleSubmitOrNext = () => {
    if (!answered) {
      // Submit Answer: mark as answered and update score if correct
      setAnswered(true);
      if (selectedOption === quizData[currentQuestion].answer) {
        setScore(score + 1);
      }
    } else {
      // Move to next question
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption("");
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setAnswered(false);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold text-white">
            Your Score: {score} / {quizData.length}
          </h2>
          <p className="mt-4 text-gray-300">
            {score === quizData.length
              ? "Excellent! You know your herbs well."
              : score >= quizData.length / 2
              ? "Good job! Keep learning more about herbs."
              : "Don't worry, keep exploring and you'll get there."}
          </p>
          <button
            onClick={resetQuiz}
            className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          {quizData[currentQuestion].question}
        </h2>
        <div className="flex flex-col space-y-4">
          {quizData[currentQuestion].options.map((option, idx) => {
            let btnStyle = "bg-gray-700 border-gray-700 text-gray-300 hover:bg-blue-600 hover:border-blue-600";
            if (answered) {
              if (option === quizData[currentQuestion].answer) {
                // Correct answer highlighted in green
                btnStyle = "bg-green-500 border-green-500 text-white";
              } else if (option === selectedOption && option !== quizData[currentQuestion].answer) {
                // Selected wrong answer highlighted in red
                btnStyle = "bg-red-500 border-red-500 text-white";
              }
            } else if (selectedOption === option) {
              // When not answered yet, selected option highlighted in blue
              btnStyle = "bg-blue-600 border-blue-600 text-white";
            }
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOptionSelect(option)}
                className={`px-4 py-3 border rounded-lg text-left transition ${btnStyle}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-gray-400">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
          <button
            onClick={handleSubmitOrNext}
            disabled={!selectedOption}
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition disabled:opacity-50"
          >
            {!answered ? "Submit Answer" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HerbalQuiz;
