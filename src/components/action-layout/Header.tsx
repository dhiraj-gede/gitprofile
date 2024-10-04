import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust the import path according to your project structure
import { setViewCompleteCode } from '../../store/questionSlice'; // Import the action

export const Header = ({ onCodeSubmit }: { onCodeSubmit: () => void }) => {
  const dispatch = useDispatch();

  // Get the view state from Redux
  const view = useSelector(
    (state: RootState) => state.question.viewCompleteCode,
  );

  const toggleView = () => {
    dispatch(setViewCompleteCode());
  };

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="text-base-content text-opacity-60">
          <div className="border-solid border-2 border-base-300 py-4 px-6 flex justify-between items-center">
            <h1 className="text-lg font-bold">LeetCode Clone</h1>
            <div className="space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
                onClick={toggleView}
              >
                {view ? 'Complete Code' : 'Editable Code'}
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
                onClick={onCodeSubmit}
              >
                Run
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
