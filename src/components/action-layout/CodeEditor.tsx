import { Dispatch, SetStateAction } from 'react';
import Split from 'react-split';
import MonacoEditor from 'react-monaco-editor';
import './horizontal.css';
import './index.css';

export const CodeEditor = ({
  language,
  code,
  setCode,
}: {
  language: string;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}) => {
  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
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
            value={code}
            options={editorOptions}
            onChange={(newCode) => setCode(newCode)}
          />
        </div>

        {/* Test Case Section */}
        <div className="flex flex-col p-4 flex-grow">
          <label className="block text-sm font-semibold mb-2">Test Case</label>
          <input
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter test case input"
          />
        </div>
      </Split>
    </div>
  );
};
