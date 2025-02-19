// marksSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../baseurl'; // Adjust this based on your setup

// Async Thunk for Submitting Marks
export const submitMarks = createAsyncThunk(
  'marks/submitMarks',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/marks`, data);
      console.log(response.data);
      return response.data; 
      // Assuming the API returns the submitted data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchStudentsMarks = createAsyncThunk(
  'marks/fetchStudentsMarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/marks/students`);
        console.log(response.data);
        
      return response.data; 
      // Assuming the API returns the submitted data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);





// Initial State
const initialState = {
  marks: [],
  loading: false,
  error: null,
  message: null,
};

// Slice
const marksSlice = createSlice({
  name: 'marks',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Submit Marks
    builder.addCase(submitMarks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitMarks.fulfilled, (state, action) => {
      state.loading = false; // Add the submitted marks data to the state
      state.message = 'Marks submitted successfully!';
    });
    builder.addCase(submitMarks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchStudentsMarks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStudentsMarks.fulfilled, (state, action) => {
      state.loading = false;
      state.marks = action.payload.marks; // Add the submitted marks data to the state
    });
    builder.addCase(fetchStudentsMarks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

   
  },
});

// Export actions and reducer
export const { resetState } = marksSlice.actions;
export default marksSlice.reducer;
