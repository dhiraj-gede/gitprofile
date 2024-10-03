import React from 'react';
import { Link } from 'react-router-dom';

interface Question {
  name: string;
  difficulty: string;
  maxScore: number;
  successRate: number;
  skill: string;
  status: 'solved' | 'unsolved';
  slug: string;
}

interface QuestionListProps {
  questions: Question[];
  loading: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, loading }) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < questions.length; index++) {
      array.push(
        <div
          className="p-4 bg-gray-800 rounded-lg shadow-md flex justify-between items-center animate-pulse"
          key={index}
        >
          <div>
            <h2 className="text-xl font-bold bg-gray-700 w-48 h-6 rounded mb-2"></h2>
            <p className="bg-gray-700 w-64 h-4 rounded"></p>
          </div>
          <div className="bg-gray-700 w-32 h-10 rounded"></div>
        </div>,
      );
    }
    return array;
  };

  return (
    <div className="p-4 pt-0 mt-0 space-y-4">
      {loading
        ? renderSkeleton()
        : questions.map((question) => (
            <Link
              key={question.slug}
              // href={`https://www.hackerrank.com/challenges/${question.slug}/problem?isFullScreen=true`}
              to={`/code?slug=${question.slug}`}
              // target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-4 bg-base-100 rounded-lg shadow-md flex justify-between items-center hover:bg-gray-700 transition-colors">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {question.name}
                  </h2>
                  <p className="text-gray-400">
                    <span
                      className={`${
                        question.difficulty === 'Easy'
                          ? 'text-green-400'
                          : question.difficulty === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      } font-semibold`}
                    >
                      {question.difficulty}
                    </span>
                    , {question.skill}, Max Score: {question.maxScore}, Success
                    Rate: {question.successRate}%
                  </p>
                </div>
                <div>
                  <button
                    className={`${
                      question.status === 'solved'
                        ? 'bg-green-600'
                        : 'bg-blue-600 hover:bg-blue-500'
                    } text-white py-2 px-4 rounded`}
                  >
                    {question.status === 'solved'
                      ? 'Solved'
                      : 'Solve Challenge'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default QuestionList;
