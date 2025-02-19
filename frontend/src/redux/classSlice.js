import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASEURL as BASE_URL} from '../baseurl'
// Base URL for your API

// CREATE Class
export const createClass = createAsyncThunk('class/createClass', async (classData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/classes`, classData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// GET All Classes
export const getClasses = createAsyncThunk('class/getClasses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/classes`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const getInstructorClasses = createAsyncThunk('class/getInstructorClasses', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/classes/instructor/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// GET Class by ID
export const getClassById = createAsyncThunk('class/getClassById', async (classId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/classes/${classId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// UPDATE Class
export const updateClass = createAsyncThunk('class/updateClass', async ({ classId, classData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/classes/${classId}`, classData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const deleteClass = createAsyncThunk('class/deleteClass', async ( classId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v1/classes/${classId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const classSlice = createSlice({
  name: 'class',
  initialState: {
    classes: [],
    classDetails: null,
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.success = false;
      state.message = null;
    },
   
  },
  extraReducers: (builder) => {
    // CREATE Class
    builder
      .addCase(createClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // GET All Classes
    builder
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getInstructorClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInstructorClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes;
      })
      .addCase(getInstructorClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET Class by ID
    builder
      .addCase(getClassById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.classDetails = action.payload.data;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE Class
    builder
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Class updated successfully"
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
         state.classes.filter(
          (cls) => cls.class_id !== action.payload.class_id
        );
        state.message = "Class deleted successfully"
        
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = classSlice.actions;

export default classSlice.reducer;

