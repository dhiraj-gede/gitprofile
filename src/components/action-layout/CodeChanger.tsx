import { FaExpand, FaSyncAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, resetCode } from '../../store/questionSlice'; // Import necessary actions
import { RootState } from '../../store'; // Import RootState for typing
import { useState } from 'react';

const languageList = ['cpp14', 'cpp', 'python', 'java'];
export const LanguageSelector: React.FC = () => {
  const dispatch = useDispatch();

  // Access the current language and languages list from Redux
  const language = useSelector((state: RootState) => state.question.language);
  const languages = useSelector((state: RootState) => state.question.languages);
  const snippets = useSelector((state: RootState) => state.question.question);
  const [supportedLanguages] = useState<string[]>(
    languageList.filter((language: string) =>
      languages.filter((x: string) => x.includes(language)),
    ),
  );

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    dispatch(setLanguage(event.target.value)); // Dispatch action to set language
  };

  const handleResetCode = () => {
    console.log('check: ', snippets);
    dispatch(resetCode(snippets)); // Dispatch action to reset code
  };

  return (
    <div className="flex justify-between items-center mb-2 ml-2">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded px-4 py-2"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <div className="space-x-4 flex">
        <button
          onClick={handleResetCode}
          className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded"
        >
          <FaSyncAlt className="mr-2" /> Reset Code
        </button>
        <button
          onClick={() => document.documentElement.requestFullscreen()}
          className="flex items-center bg-gray-700 text-white px-3 py-2 rounded"
        >
          <FaExpand className="mr-2" /> Full Screen
        </button>
      </div>
    </div>
  );
};
