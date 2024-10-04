import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

// Define types for the state and question data
export interface CodeTemplate {
  templateHead: string;
  templateTail: string;
  template: string;
}

export interface Solution {
  code: string;
  language: string;
}

export interface Question {
  languages: string[];
  cpp14_template: string;
  cpp14_templateHead: string;
  cpp14_templateTail: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // For additional properties
}

export interface QuestionState {
  language: string;
  code: CodeTemplate;
  question: Question | null;
  solution?: Solution;
  loading: boolean;
  languages: string[];
  viewCompleteCode: boolean;
  currentCode: CodeTemplate;
  slug: string;
}

// Initial state
const initialState: QuestionState = {
  language: '',
  code: {
    templateHead: '',
    templateTail: '',
    template: '',
  },
  question: null,
  loading: true,
  languages: [],
  currentCode: {
    templateHead: '',
    templateTail: '',
    template: '',
  },
  viewCompleteCode: false,
  slug: '',
};

// Thunk to fetch question data
export const fetchQuestion = createAsyncThunk<
  Question,
  string,
  { rejectValue: unknown }
>('question/fetchQuestion', async (slug, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/hackerrank/question/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data);
  }
});

// Create a slice
const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      const selectedLang = action.payload;
      console.log('selected: ', selectedLang);
      state.language = selectedLang;

      if (state.question) {
        const filteredKey = `${selectedLang}_template`;
        state.code = {
          templateHead: state.question[`${filteredKey}_head`] || '',
          templateTail: state.question[`${filteredKey}_tail`] || '',
          template: state.question[filteredKey] || '',
        };
      }
    },
    setCode: (state, action: PayloadAction<CodeTemplate>) => {
      state.code = {
        template: action.payload.template,
        templateHead: state.code.templateHead,
        templateTail: state.code.templateTail,
      };
    },
    setViewCompleteCode: (state) => {
      state.viewCompleteCode = !state.viewCompleteCode;
    },
    setSlug: (state, action: PayloadAction<string>) => {
      state.slug = action.payload;
    },
    setCurrentCode: (state, action: PayloadAction<CodeTemplate>) => {
      state.currentCode = {
        ...action.payload,
        templateHead: state.code.templateHead,
        templateTail: state.code.templateTail,
      };
    },
    setSolution: (state, action: PayloadAction<Solution>) => {
      state.solution = { ...action.payload, language: state.language };
    },
    resetCode: (state, action) => {
      if (action.payload && state.language) {
        const filteredKey = Object.keys(action.payload).filter((x: string) => {
          const t: string[] = x.split('_');
          return t[0] === state.language;
        })[0];
        console.log('filteredKey', filteredKey, action.payload);

        state.code = {
          template: action.payload[filteredKey],
          templateHead: action.payload[filteredKey + '_head'],
          templateTail: action.payload[filteredKey + '_tail'],
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchQuestion.fulfilled,
        (state, action: PayloadAction<Question>) => {
          state.languages = action.payload.languages;
          state.question = action.payload;

          // Set code based on the default language (cpp14)
          state.code = {
            templateHead: state.code.templateHead,
            templateTail: state.code.templateTail,
            template: state.code.template,
          };

          state.loading = false;
        },
      )
      .addCase(fetchQuestion.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Export actions and reducer
export const {
  setLanguage,
  setCode,
  setViewCompleteCode,
  setSlug,
  resetCode,
  setCurrentCode,
  setSolution,
} = questionSlice.actions;
export default questionSlice.reducer;
