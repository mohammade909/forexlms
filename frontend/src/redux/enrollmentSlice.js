import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 import {BASEURL } from '../baseurl'
// Replace with your actual API base URL

// Fetch enrollments by student ID
export const getEnrollmentsByStudentID = createAsyncThunk(
  'enrollments/getByStudentID',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/enrollments/${studentId}`);
      return response.data.enrollments;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchEnrollmentsByCourse = createAsyncThunk(
  'enrollments/fetchEnrollmentsByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/enrollments/course/${courseId}`);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch all enrollments
export const getAllEnrollments = createAsyncThunk(
  'enrollments/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/enrollments`);
      return response.data.enrollments;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  enrollments: [],
  loading: false,
  error: null,
  message:null
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    // Add additional non-async reducers if needed
  },
  extraReducers: (builder) => {
    // Fetch enrollments by student ID
    builder
      .addCase(getEnrollmentsByStudentID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEnrollmentsByStudentID.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(getEnrollmentsByStudentID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchEnrollmentsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload.enrollments;
      })
      .addCase(fetchEnrollmentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all enrollments
    builder
      .addCase(getAllEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(getAllEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default enrollmentSlice.reducer;
