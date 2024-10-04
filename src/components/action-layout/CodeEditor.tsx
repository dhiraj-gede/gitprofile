import { useEffect } from 'react';
import Split from 'react-split';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store'; // Import RootState for typing
import {
  setCode,
  setCurrentCode,
  setLanguage,
} from '../../store/questionSlice'; // Import setCode action
import './horizontal.css';
import './index.css';
import TestCaseTabs from './TestcaseTabs';

interface CodeEditorProps {
  // language: string;
  view: boolean;
  problemId: string;
}
interface currentCode {
  template: string;
  templateHead: string;
  templateTail: string;
}

export const CodeEditor = ({ view, problemId }: CodeEditorProps) => {
  const dispatch = useDispatch();

  // Select code state from Redux
  const code = useSelector((state: RootState) => state.question.code);
  const question = useSelector((state: RootState) => state.question);
  const language = useSelector((state: RootState) => state.question.language);
  const currentCode = useSelector(
    (state: RootState) => state.question.currentCode,
  );

  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    readOnly: view,
  };

  // const [currentCode, setCurrentCode] = useState<currentCode>({
  //   template: '',
  //   templateHead: '',
  //   templateTail: '',
  // });

  useEffect(() => {
    console.log('view', view, code);
    if (view) {
      dispatch(setCurrentCode({ ...code, template: currentCode.template }));
    } else {
      dispatch(
        setCurrentCode({
          template: code.template,
          templateHead: '',
          templateTail: '',
        }),
      );
    }
  }, [view, language, code, currentCode.template, dispatch]);

  useEffect(() => {
    dispatch(setLanguage('cpp14'));
  }, [dispatch]);

  const handleCodeChange = (newCode: string) => {
    console.log('code', question);
    dispatch(
      setCode({
        templateHead: code.templateHead,
        template: newCode,
        templateTail: code.templateTail,
      }),
    );
  };
  const getCode = (codeObj: currentCode): string => {
    return view
      ? codeObj.templateHead + codeObj.template + codeObj.templateTail
      : codeObj.template;
  };

  return (
    <div className="flex flex-col h-full">
      <Split
        className="flex-grow"
        sizes={[50, 50]} // Adjusts the proportion of the editor to the test case section
        minSize={[100, 100]} // Minimum sizes for both sections
        gutterSize={8} // Space between the panels
        direction="vertical" // Split direction is vertical for horizontal layout
      >
        {/* Monaco Editor */}
        <div className="h-full flex-grow">
          <MonacoEditor
            width="100%"
            height="100%" // Ensure height fills the available space
            language={language.toLowerCase()}
            theme="vs-dark"
            value={getCode(currentCode)}
            options={editorOptions}
            onChange={handleCodeChange} // Use the new handleCodeChange function
          />
        </div>

        {/* Test Case Section */}
        <TestCaseTabs problemId={problemId} />
      </Split>
    </div>
  );
};
