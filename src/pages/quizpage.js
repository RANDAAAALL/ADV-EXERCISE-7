import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const quizQuestions = [
  { question: "Who was the first president of the United States?", options: ["George Washington", "Abraham Lincoln", "John Adams", "Thomas Jefferson"], answer: "George Washington" },
  { question: "When did World War II end?", options: ["1945", "1939", "1941", "1943"], answer: "1945" },
  { question: "What year did the Titanic sink?", options: ["1912", "1905", "1920", "1918"], answer: "1912" },
  { question: "Who discovered America?", options: ["Christopher Columbus", "Leif Erikson", "Ferdinand Magellan", "James Cook"], answer: "Christopher Columbus" },
  { question: "What empire did Julius Caesar rule?", options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "British Empire"], answer: "Roman Empire" },
  { question: "Which country was the first to land on the moon?", options: ["USA", "Russia", "China", "Germany"], answer: "USA" },
  { question: "In what year did the French Revolution begin?", options: ["1789", "1812", "1756", "1820"], answer: "1789" },
  { question: "Who wrote the Declaration of Independence?", options: ["Thomas Jefferson", "Benjamin Franklin", "George Washington", "John Adams"], answer: "Thomas Jefferson" },
  { question: "What war was fought between the North and South regions in the United States?", options: ["Civil War", "World War I", "Revolutionary War", "Mexican-American War"], answer: "Civil War" },
  { question: "Who was the first man to step on the moon?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], answer: "Neil Armstrong" }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Quiz() {
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(null);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setQuestions(shuffleArray([...quizQuestions]));
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      goToNextQuestion();
    }

    if (timerActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, timerActive]);

  useEffect(() => {
    // Shuffle options for the current question
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setShuffledOptions(shuffleArray([...currentQuestion.options]));
    }
  }, [currentQuestionIndex, questions]);

  const handleOptionClick = (option) => {
    if (isQuizOver || showCorrectAnswer) return;

    const newSelectedAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newSelectedAnswers);
    setShowCorrectAnswer(true);
    setTimerActive(false);
  };

  const goToNextQuestion = () => {
    setShowCorrectAnswer(false);
    setTimeLeft(30);
    setTimerActive(true);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const totalScore = selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].answer ? 1 : 0);
    }, 0);
    setScore(totalScore);
    setIsQuizOver(true);
  };

  const restartQuiz = () => {
    setIsLoading(true); 
    setTimeout(() => {
      setQuestions(shuffleArray([...quizQuestions]));
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setScore(null);
      setIsQuizOver(false);
      setShowCorrectAnswer(false);
      setTimeLeft(30);
      setTimerActive(true);
      setIsLoading(false);
    }, 2000);
  };

  const goToLandingPage = () => {
    setIsLoading(true); 
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
            <div className="text-3xl text-white">Loading...</div>
          </div>
        ) : (
          !isQuizOver && (
            <>
              <div className="mb-4 text-xl flex justify-between">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Time Left: {timeLeft}s</span>
              </div>

              <h1 className="text-2xl font-bold mb-6">{questions[currentQuestionIndex].question}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {shuffledOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`py-2 px-4 rounded-md text-lg transition ${
                      showCorrectAnswer && option === questions[currentQuestionIndex].answer
                        ? 'bg-green-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    disabled={showCorrectAnswer}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showCorrectAnswer && (
                <div className="text-center">
                  <p className="mb-4">
                    {selectedAnswers[currentQuestionIndex] === questions[currentQuestionIndex].answer
                      ? "Correct!"
                      : `Wrong! The correct answer is: ${questions[currentQuestionIndex].answer}`}
                  </p>
                  <button
                    onClick={goToNextQuestion}
                    className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-md text-lg transition"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </>
          )
        )}

        {isQuizOver && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Over!</h2>
            <p className="text-xl mb-6">Your Score: {score} / {questions.length}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-md text-lg transition"
              >
                Retake Quiz
              </button>
              <button
                onClick={goToLandingPage}
                className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-md text-lg transition"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-6 text-sm text-gray-400">
        Lester Andg @ All rights reserved
      </footer>
    </div>
  );
}
