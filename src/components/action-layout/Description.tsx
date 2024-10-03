import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // Import RootState for typing

export const Description: React.FC = () => {
  // Access the question from the Redux store with proper typing
  const question = useSelector((state: RootState) => state.question.question);

  if (!question) {
    return <div>Loading...</div>; // Show a loading message if the question is null or undefined
  }

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="text-base-content text-opacity-60">
          <div dangerouslySetInnerHTML={{ __html: question.body_html }}></div>
        </div>
      </div>
    </div>
  );
};
