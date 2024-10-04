import { useState, useEffect, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchTestCases, submitBulkTestCases } from '../../store/questionSlice';
import { AppDispatch, RootState } from '../../store'; // Adjust this path accordingly
import { fetchTestCases, submitBulkTestCases } from '../../store/testCaseSlice';

interface TestCase {
  input: string;
  expected_output: string[];
}

const TestCaseTabs = ({ problemId }: { problemId: string }) => {
  const dispatch: AppDispatch = useDispatch();
  const { testCases, loading } = useSelector(
    (state: RootState) => state.testCases,
  );

  const [activeTab, setActiveTab] = useState(1); // 1: Show, 2: Bulk Add/Edit
  const [bulkTestCaseJSON, setBulkTestCaseJSON] = useState<string>(''); // For bulk input/output in JSON format

  // Fetch test cases when component mounts or active tab changes to Bulk Add/Edit
  useEffect(() => {
    if (activeTab === 1) {
      if (testCases && !testCases[0]) dispatch(fetchTestCases(problemId));
    } else if (activeTab === 2) {
      const jsonTestCases = JSON.stringify({ test_cases: testCases }, null, 2);
      setBulkTestCaseJSON(jsonTestCases); // Prepopulate the textarea with current test cases in JSON format
    }
  }, [activeTab, problemId, dispatch, testCases]);

  // Handle bulk test case submission (Add/Edit)
  const handleBulkSubmit = async (
    e: MouseEvent<HTMLButtonElement>,
    type: 'put' | 'post',
  ) => {
    e.preventDefault();
    try {
      const parsedTestCases = JSON.parse(bulkTestCaseJSON); // Parse the JSON from textarea
      const payload: {
        problemId: string;
        testCases: TestCase[];
        sampleTestCases: TestCase[];
        type: 'put' | 'post';
      } = {
        problemId,
        testCases: parsedTestCases.test_cases, // Adjusted key name
        sampleTestCases: parsedTestCases.test_cases,
        type,
      };

      if (parsedTestCases.test_cases) {
        // Use PUT or POST request to update test cases
        await dispatch(submitBulkTestCases(payload)).unwrap(); // For handling the fulfilled/rejected state
        setActiveTab(1); // Go back to 'Show Test Cases' after successful submission
      } else {
        console.error(
          'Invalid format. JSON must contain "test_cases" as a key.',
        );
      }
    } catch (err) {
      console.error('Invalid JSON format:', err);
    }
  };

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li className="me-2">
          <button
            className={`inline-block px-4 py-3 rounded-lg ${
              activeTab === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(1)}
          >
            Show Test Cases
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block px-4 py-3 rounded-lg ${
              activeTab === 2 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(2)}
          >
            {testCases && testCases[0] ? 'Update Test Cases' : 'Add Test Cases'}
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Cases</h2>
            {loading ? (
              <p>Loading test cases...</p>
            ) : (
              <ul className="list-disc pl-6">
                {testCases.map((testCase, index) => (
                  <li key={index}>
                    <div>Input: {testCase.input}</div>
                    <div>
                      Expected Output:{' '}
                      {Array.isArray(testCase.expected_output)
                        ? testCase.expected_output.join(', ')
                        : testCase.expected_output}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {testCases && testCases[0]
                ? 'Update Test Cases'
                : 'Add Test Cases'}
            </h2>
            <label className="block text-sm font-semibold mb-2">
              Paste Test Cases JSON (Bulk)
            </label>
            <textarea
              className="border border-gray-300 rounded px-4 py-2 w-full h-48"
              placeholder={`{"test_cases": [{"input": "...", "expected_output": ["..."]}]}`}
              value={bulkTestCaseJSON}
              onChange={(e) => setBulkTestCaseJSON(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 mt-4"
              onClick={(e) => handleBulkSubmit(e, 'put')} // You can change 'post' to 'put' based on your logic
            >
              Submit Bulk Test Cases
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseTabs;
