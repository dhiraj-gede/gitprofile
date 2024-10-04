import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

// Define the shape of your test case data
interface TestCase {
  input: string;
  expected_output: string[];
}

// Define the state for the test case slice
interface TestCaseState {
  testCases: TestCase[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TestCaseState = {
  testCases: [],
  loading: false,
  error: null,
};

// Thunk to fetch test cases for a question
export const fetchTestCases = createAsyncThunk<
  TestCase[],
  string,
  { rejectValue: unknown }
>('testCases/fetchTestCases', async (problemId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/testcases/${problemId}`,
    );
    return response.data.test_cases;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data);
  }
});

// Thunk to submit bulk test cases
export const submitBulkTestCases = createAsyncThunk<
  TestCase[],
  {
    problemId: string;
    testCases: TestCase[];
    sampleTestCases: TestCase[];
    type: 'put' | 'post';
  },
  { rejectValue: unknown }
>(
  'testCases/submitBulkTestCases',
  async (
    { problemId, testCases, sampleTestCases, type },
    { rejectWithValue },
  ) => {
    try {
      const payload: {
        test_cases: TestCase[];
        sample_test_cases: TestCase[];
        problemId?: string;
      } = {
        test_cases: testCases,
        sample_test_cases: sampleTestCases,
      };
      if (type === 'post') payload.problemId = problemId;
      const response = await axios[type](
        `http://localhost:5000/api/testcases/${type === 'put' ? problemId : ''}`,
        payload,
      );
      return response.data.test_cases;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data);
    }
  },
);

// Create the test case slice
const testCaseSlice = createSlice({
  name: 'testCases',
  initialState,
  reducers: {
    clearTestCases(state) {
      state.testCases = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTestCases.fulfilled,
        (state, action: PayloadAction<TestCase[]>) => {
          state.testCases = action.payload;
          state.loading = false;
        },
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchTestCases.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(
        submitBulkTestCases.fulfilled,
        (state, action: PayloadAction<TestCase[]>) => {
          state.testCases = action.payload;
        },
      );
  },
});

// Export actions and reducer
export const { clearTestCases } = testCaseSlice.actions;
export default testCaseSlice.reducer;
