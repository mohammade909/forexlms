import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {BASEURL as BASE_URL} from '../baseurl' // Replace with your actual API base URL

// Async thunks for API operations
export const submitHomework = createAsyncThunk(
    "homework/submitHomework",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${BASE_URL}/api/v1/homeworks`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
export const getHomeworkByClass = createAsyncThunk(
  "homework/getHomeworkByClass",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/homeworks/class/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStudentHomework = createAsyncThunk(
  "homework/getStudentHomework",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/homeworks/student/${studentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const updateHomework = createAsyncThunk(
  "homework/updateHomework",
  async ({ homeworkId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${homeworkId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHomework = createAsyncThunk(
  "homework/deleteHomework",
  async (homeworkId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${homeworkId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const homeworkSlice = createSlice({
  name: "homework",
  initialState: {
    homeworks: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Submit Homework
      .addCase(submitHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(submitHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Homework by Class
      .addCase(getHomeworkByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeworkByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworks = action.payload.homework;
      })
      .addCase(getHomeworkByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Student Homework
      .addCase(getStudentHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworks = action.payload.homework;
      })
      .addCase(getStudentHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Homework
      .addCase(updateHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Homework
      .addCase(deleteHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default homeworkSlice.reducer;
