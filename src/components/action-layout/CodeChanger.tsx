import { FaExpand, FaSyncAlt } from 'react-icons/fa';

const languages = ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript'];

export const LanguageSelector = ({
  language,
  setLanguage,
  handleResetCode,
}: {
  language: string;
  setLanguage: (val: string) => void;
  handleResetCode: () => void;
}) => (
  <div className="flex justify-between items-center mb-2 ml-2">
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="border border-gray-300 rounded px-4 py-2"
    >
      {languages.map((lang) => (
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
