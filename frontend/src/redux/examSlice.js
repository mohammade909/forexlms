import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../baseurl'; // Adjust this based on your setup

// Create Exam
export const createExam = createAsyncThunk(
  'exam/createExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/exam`, examData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get All Exams
export const getExams = createAsyncThunk(
  'exam/getExams',
  async ({ class_id } = {}, { rejectWithValue }) => {
    try {
      // Build query parameters based on optional class_id
      let url = `${BASEURL}/api/v1/exam/with-subjects`;
      if (class_id) {
        url += `?class_id=${class_id}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


// Get Exam by ID
export const getExamById = createAsyncThunk(
  'exam/getExamById',
  async (examId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/exams/${examId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Exam
export const updateExam = createAsyncThunk(
  'exam/updateExam',
  async ({ examId, examData }, { rejectWithValue }) => {
    try {
        console.log(examData);
        
      const response = await axios.put(`${BASEURL}/api/v1/exam/${examId}`, examData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Exam
export const deleteExam = createAsyncThunk(
  'exam/deleteExam',
  async (examId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASEURL}/api/v1/exam/${examId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const initialState = {
  exams: [],
  exam: null,
  loading: false,
  error: null,
  message: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    resetState:(state)=>{
     state.loading = false
     state.error =null
     state.message = null
    }
  },
  extraReducers: (builder) => {
    // Create Exam
    builder.addCase(createExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createExam.fulfilled, (state, action) => {
      state.loading = false;
      state.message = 'Exam created successfull!' // Adding new exam
    });
    builder.addCase(createExam.rejected, (state, action) => {
        
      state.loading = false;
      state.error = action.payload.message;
    });

    // Get All Exams
    builder.addCase(getExams.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getExams.fulfilled, (state, action) => {
      state.loading = false;
      state.exams = action.payload;
    });
    builder.addCase(getExams.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Exam by ID
    builder.addCase(getExamById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getExamById.fulfilled, (state, action) => {
      state.loading = false;
      state.exam = action.payload;
    });
    builder.addCase(getExamById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Exam
    builder.addCase(updateExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExam.fulfilled, (state, action) => {
      state.loading = false;
      state.message = 'Exam updated successfull!'; // Update exam
    });
    builder.addCase(updateExam.rejected, (state, action) => {

      state.loading = false;
      state.err = action.payload.error;
    });

    // Delete Exam
    builder.addCase(deleteExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteExam.fulfilled, (state, action) => {
      state.loading = false;
      state.exams = state.exams.filter((exam) => exam.exam_id !== action.meta.arg); // Remove deleted exam
    });
    builder.addCase(deleteExam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });
  },
});

export const { resetState } = examSlice.actions; // Reset state when necessary. For example, after deleting an exam.  Note: This action does not remove the deleted exam from the state, only resets the state to its initial values.  If you want to remove the deleted exam from the state, you would need to implement a separate action to handle that.  Also, this action does not handle the case where the exam is not found in the state.  You would need

export default examSlice.reducer;
