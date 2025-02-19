import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API requests (you can replace it with your own API base URL)
import { BASEURL } from "../baseurl";
const BASE_URL = `${BASEURL}/api/v1/inquiries/`;
// Async thunks for API requests
export const createInquiry = createAsyncThunk(
  "courseInquiries/create",
  async (inquiryData, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL, inquiryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllInquiries = createAsyncThunk(
  "courseInquiries/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getInquiryById = createAsyncThunk(
  "courseInquiries/getById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateInquiry = createAsyncThunk(
  "courseInquiries/update",
  async ({ id, inquiryData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, inquiryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteInquiry = createAsyncThunk(
  "courseInquiries/delete",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const inquirySlice = createSlice({
  name: "inquiries",
  initialState: {
    inquiries: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle creating an inquiry
      .addCase(createInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Inquiry created successfully"
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetching all inquiries
      .addCase(getAllInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload;
      })
      .addCase(getAllInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = "Couldn't send request ";
      })
      // Handle fetching an inquiry by ID
      .addCase(getInquiryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = [action.payload];
      })
      .addCase(getInquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updating an inquiry
      .addCase(updateInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInquiry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.inquiries.findIndex(
          (inquiry) => inquiry.request_id === action.payload.request_id
        );
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
      })
      .addCase(updateInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleting an inquiry
      .addCase(deleteInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = state.inquiries.filter(
          (inquiry) => inquiry.request_id !== action.payload
        );
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = inquirySlice.actions;
// Export the reducer
export default inquirySlice.reducer;
