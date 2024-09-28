import colors from '../data/colors.json';

type Colors = {
  [key: string]: { color: string | null; url: string };
};
export const getLanguageColor = (language: string): string => {
  const languageColors: Colors = colors;

  if (typeof languageColors[language] !== 'undefined') {
    return languageColors[language].color || 'gray';
  } else {
    return 'gray';
  }
};
