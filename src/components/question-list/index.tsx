import { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionList from './QuestionList';
interface Question {
  name: string;
  difficulty_name: string;
  max_score: number;
  solved_count: number;
  skill: string;
  user_score: number;
  slug: string;
  total_count: number;
}
const QuestionComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const requestObject = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        };
        const response = await axios.get(
          'http://localhost:5000/api/hackerrank/questions?offset=10&limit=10',
          requestObject,
        );
        const questionData = response.data.models.map((question: Question) => ({
          name: question.name,
          difficulty: question.difficulty_name,
          maxScore: question.max_score,
          successRate: (question.solved_count / question.total_count) * 100,
          skill: question.skill,
          status: question.user_score > 0 ? 'solved' : 'unsolved',
          slug: question.slug,
        }));
        setQuestions(questionData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
    // setLoading(false);
  }, [questions]);

  return (
    <div className="flex space-x-6 p-6 pt-0">
      {/* Question List */}
      <div className="w-full">
        <QuestionList questions={questions} loading={loading} />
      </div>
    </div>
  );
};

export default QuestionComponent;
