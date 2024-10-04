import { useEffect } from 'react';
import Split from 'react-split';
import { useDispatch, useSelector } from 'react-redux';
import { Description } from './Description';
import { Header } from './Header';
import { LanguageSelector } from './CodeChanger';
import { CodeEditor } from './CodeEditor';
import { fetchQuestion, setSlug, setSolution } from '../../store/questionSlice';
import axios from 'axios';
import './vertical.css';
import './index.css';
import { AppDispatch, RootState } from '../../store'; // Import RootState for typing

const ActionLayout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Typed selector for accessing question state
  const { question, currentCode, language, loading, viewCompleteCode, slug } =
    useSelector((state: RootState) => state.question); // Type the state with RootState
  const { testCases } = useSelector((state: RootState) => state.testCases); // Type the state with RootState

  useEffect(() => {
    const slugFromUrl =
      new URLSearchParams(window.location.search).get('slug') || '';
    dispatch(setSlug(slugFromUrl));
  }, [dispatch]);

  useEffect(() => {
    if (slug) {
      dispatch(fetchQuestion(slug));
    }
  }, [slug, dispatch]);

  const handleOnCodeSubmit = async () => {
    const fullCode =
      currentCode.templateHead +
      currentCode.template +
      currentCode.templateTail;

    // Prepare the payload for the API
    const payload = {
      code: fullCode,
      language, // Selected language from state
      test_cases: { test_cases: testCases }, // List of test cases from the state
    };

    try {
      // Make the API request to execute the code
      const response = await axios.post(
        'http://localhost:5000/api/code/execute',
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Add the token if required
          },
        },
      );

      // Log or handle the results of the code execution
      console.log('Execution Results:', response.data);

      // Optionally, you can update the state with the solution results
      dispatch(setSolution({ code: fullCode, language }));
    } catch (error) {
      console.error('Code execution failed:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onCodeSubmit={handleOnCodeSubmit} />

      {!loading && (
        <Split
          className="flex-grow flex border-gray-300"
          sizes={[50, 50]}
          minSize={200}
          gutterSize={8}
          cursor="col-resize"
        >
          <Description />

          <div className="flex flex-col h-full">
            <LanguageSelector />
            <CodeEditor view={viewCompleteCode} problemId={question?.id} />
          </div>
        </Split>
      )}
    </div>
  );
};

export default ActionLayout;
