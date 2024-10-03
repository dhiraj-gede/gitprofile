import { useEffect } from 'react';
import Split from 'react-split';
import { useDispatch, useSelector } from 'react-redux';
import { Description } from './Description';
import { Header } from './Header';
import { LanguageSelector } from './CodeChanger';
import { CodeEditor } from './CodeEditor';
import { fetchQuestion, setSlug } from '../../store/questionSlice';
import './vertical.css';
import './index.css';
import { AppDispatch, RootState } from '../../store'; // Import RootState for typing

const ActionLayout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Typed selector for accessing question state
  const { question, loading, viewCompleteCode, slug } = useSelector(
    (state: RootState) => state.question,
  ); // Type the state with RootState

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
    // Code for handling submission, same as before.
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
