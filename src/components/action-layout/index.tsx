import { useState } from 'react';
import Split from 'react-split';
import { Description } from './Description';
import { Header } from './Header';
import { LanguageSelector } from './CodeChanger';
import { CodeEditor } from './CodeEditor';
import './vertical.css';
interface CodeSnippets {
  [language: string]: string;
}

const defaultCode: CodeSnippets = {
  'C++': '#include <iostream>\nint main() { std::cout << "Hello, World!"; }',
  Python: 'print("Hello, World!")',
  Java: 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }',
  JavaScript: 'console.log("Hello, World!");',
  TypeScript: 'console.log("Hello, World!");',
};

const ActionLayout = () => {
  const [language, setLanguage] = useState('C++');
  const [code, setCode] = useState(defaultCode[language]);

  // Function to handle language change
  const handleLanguageChange = (selectedLang: string) => {
    setLanguage(selectedLang);
    setCode(defaultCode[selectedLang]);
  };

  // Function to reset code to default
  const handleResetCode = () => {
    setCode(defaultCode[language]);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      {/* Split Pane for Left and Right sections */}
      <Split
        className="flex-grow flex border-gray-300"
        sizes={[50, 50]}
        minSize={200}
        gutterSize={8}
        cursor="col-resize"
      >
        {/* Left Pane (Description) */}
        <Description />

        {/* Right Pane (Code Editor and Test Cases) */}
        <div className="flex flex-col h-full">
          <LanguageSelector
            language={language}
            setLanguage={handleLanguageChange}
            handleResetCode={handleResetCode}
          />
          <CodeEditor language={language} code={code} setCode={setCode} />
        </div>
      </Split>
    </div>
  );
};

export default ActionLayout;
