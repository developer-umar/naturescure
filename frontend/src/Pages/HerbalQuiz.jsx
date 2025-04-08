import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Expanded quiz data with more herbal medicine/plant-related questions
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
  },
  {
    question: "Which herb is known for its antibacterial and skin-purifying properties?",
    options: ["Neem", "Tulsi", "Shatavari", "Ginger"],
    answer: "Neem",
    explanation: "Neem is widely used in skincare for its antibacterial effects."
  },
  {
    question: "Which plant is used in Ayurveda to support heart health?",
    options: ["Arjuna", "Aloe Vera", "Brahmi", "Giloy"],
    answer: "Arjuna",
    explanation: "Arjuna bark is known for its cardiovascular benefits."
  },
  {
    question: "Which herb is commonly used to detoxify the body?",
    options: ["Giloy", "Ashwagandha", "Calendula", "Sandalwood"],
    answer: "Giloy",
    explanation: "Giloy is a powerful detoxifier and immunity booster."
  },
  {
    question: "Which herb is used to promote hair growth and reduce hair fall?",
    options: ["Bhringraj", "Neem", "Amla", "Tulsi"],
    answer: "Bhringraj",
    explanation: "Bhringraj is known as the 'king of herbs' for hair health."
  },
  {
    question: "Which plant is used to soothe digestive issues?",
    options: ["Ginger", "Aloe Vera", "Shatavari", "Calendula"],
    answer: "Ginger",
    explanation: "Ginger aids digestion and reduces nausea."
  },
];

// Function to get 5 random questions from quizData
const getRandomQuestions = (data, count = 5) => {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const HerbalQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Initialize random questions on mount and reset
  useEffect(() => {
    setQuestions(getRandomQuestions(quizData));
  }, []);

  const handleOptionSelect = (option) => {
    if (!answered) {
      setSelectedOption(option);
    }
  };

  const handleSubmitOrNext = () => {
    if (!answered) {
      // Submit Answer: mark as answered and update score if correct
      setAnswered(true);
      if (selectedOption === questions[currentQuestion].answer) {
        setScore(score + 1);
      }
    } else {
      // Move to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption("");
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }
  };

  const resetQuiz = () => {
    setQuestions(getRandomQuestions(quizData)); // New random questions on reset
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
            Your Score: {score} / {questions.length}
          </h2>
          <p className="mt-4 text-gray-300">
            {score === questions.length
              ? "Excellent! You know your herbs well."
              : score >= questions.length / 2
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

  if (questions.length === 0) {
    return <div className="text-white">Loading...</div>; // Fallback while questions load
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
          {questions[currentQuestion].question}
        </h2>
        <div className="flex flex-col space-y-4">
          {questions[currentQuestion].options.map((option, idx) => {
            let btnStyle = "bg-gray-700 border-gray-700 text-gray-300 hover:bg-blue-600 hover:border-blue-600";
            if (answered) {
              if (option === questions[currentQuestion].answer) {
                btnStyle = "bg-green-500 border-green-500 text-white";
              } else if (option === selectedOption && option !== questions[currentQuestion].answer) {
                btnStyle = "bg-red-500 border-red-500 text-white";
              }
            } else if (selectedOption === option) {
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
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <button
            onClick={handleSubmitOrNext}
            disabled={!selectedOption}
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition disabled:opacity-50"
          >
            {!answered ? "Submit Answer" : "Next"}
          </button>
        </div>
        {answered && (
          <p className="mt-4 text-gray-300">
            {questions[currentQuestion].explanation}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default HerbalQuiz;