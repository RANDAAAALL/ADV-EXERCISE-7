import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LandingPage() {  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTakeQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/quizpage'); 
    }, 1000); 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-5">
      {loading ? (
        <div className="text-center text-3xl">Loading...</div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Ready to take a quiz about History?</h1>
          <button
            onClick={handleTakeQuiz}
            className="bg-blue-600 hover:bg-blue-500 py-3 px-6 rounded-md text-lg transition"
          >
            Take Quiz
          </button>
        </div>
      )}
    </div>
  );
}
