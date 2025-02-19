import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL } from '../baseurl'; // Adjust this based on your setup

// Async Thunks for Subject Fields

// Fetch Subject Fields
export const fetchSubjectfields = createAsyncThunk(
  'subjectfields/fetchSubjectfields',
  async ({ class_id, section_id, subject_id } = {}, { rejectWithValue }) => {
    try {
      let response;

      // Check if any params are provided and include them in the request
      if (class_id || section_id || subject_id) {
        response = await axios.get(`${BASEURL}/api/v1/field`, {
          params: { class_id, section_id, subject_id }, // Add params to the request if provided
        });
      } else {
        response = await axios.get(`${BASEURL}/api/v1/field`); // Simple request without params
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Add Subject Field
export const addSubjectfields = createAsyncThunk(
  'subjectfields/addSubjectfields',
  async (subjectfields, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/field`, subjectfields);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Subject Field
export const updateSubjectfields = createAsyncThunk(
  'subjectfields/updateSubjectfields',
  async ({ fieldId, fieldData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASEURL}/api/v1/field/${fieldId}`, fieldData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete Subject Field
export const deleteSubjectfields = createAsyncThunk(
  'subjectfields/deleteSubjectfields',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASEURL}/api/v1/field/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  fields: [],
  field: null,
  loading: false,
  error: null,
  message: null,
};

// Slice
const subjectFieldsSlice = createSlice({
  name: 'subjectfields',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Subject Fields
    builder.addCase(fetchSubjectfields.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubjectfields.fulfilled, (state, action) => {
      state.loading = false;
      state.fields = action.payload;
    });
    builder.addCase(fetchSubjectfields.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add Subject Field
    builder.addCase(addSubjectfields.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addSubjectfields.fulfilled, (state, action) => {
      state.loading = false;
      state.fields.push(action.payload);
      state.message = 'Subject field added successfully!';
    });
    builder.addCase(addSubjectfields.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Subject Field
    builder.addCase(updateSubjectfields.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSubjectfields.fulfilled, (state, action) => {
        
        state.message =action.payload.message
     
      state.loading = false;
    });
    builder.addCase(updateSubjectfields.rejected, (state, action) => {
        console.log(action.payload);
        
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Subject Field
    builder.addCase(deleteSubjectfields.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSubjectfields.fulfilled, (state, action) => {
      console.log(action.payload);
      state.fields = state.fields.filter((field) => field.id !== action.meta.arg);
      state.message = 'Subject field deleted successfully!';
      state.loading = false;
    });
    builder.addCase(deleteSubjectfields.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetState } = subjectFieldsSlice.actions;
export default subjectFieldsSlice.reducer;
