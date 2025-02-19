import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASEURL} from '../baseurl' // Replace with your API base URL

// Fetch all fees
export const fetchAllFees = createAsyncThunk('fees/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASEURL}/api/v1/fees`);
    return response.data; // Data from the API
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch fees by student ID
export const fetchFeesByStudentId = createAsyncThunk(
  'fees/fetchByStudentId',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/fees/student/${studentId}`);
      return response.data; // Data from the API
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new fee
export const createFee = createAsyncThunk('fees/create', async (feeData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASEURL}/api/v1/fees`, feeData);
    return response.data; // Data from the API
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


const initialState = {
  fees: [], // List of all fees
  loading: false,
  error: null,
  message: null,
};

const feeSlice = createSlice({
  name: 'fees',
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch all fees
    builder
      .addCase(fetchAllFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload.data;
      })
      .addCase(fetchAllFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Fetch fees by student ID
    builder
      .addCase(fetchFeesByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload.fees;
      })
      .addCase(fetchFeesByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Create a new fee
    builder
      .addCase(createFee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees.push(action.payload);
        state.successMessage = 'Fee created successfully!';
      })
      .addCase(createFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetState } = feeSlice.actions;
export default feeSlice.reducer;
