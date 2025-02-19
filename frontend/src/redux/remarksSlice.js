import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl"; // Base URL for API

// Fetch all remarks for a specific student
export const fetchRemarksByStudentId = createAsyncThunk(
  "remarks/fetchRemarksByStudentId",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/remarks/student/${studentId}`);
          
      
      return response.data; // Expecting { success: true, remarks: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch remarks");
    }
  }
);

// Create a new remark
export const createRemark = createAsyncThunk(
  "remarks/createRemark",
  async (remarkData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/remarks`, remarkData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Expecting { success: true, remark_id: ..., message: 'Remark created successfully' }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong while creating the remark");
    }
  }
);

// Update a remark
export const updateRemark = createAsyncThunk(
  "remarks/updateRemark",
  async ({ remarkId, remarkData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASEURL}/api/v1/remarks/${remarkId}`, remarkData);
      return { remarkId, ...response.data }; // Expecting { success: true, message: 'Remark updated successfully' }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update the remark");
    }
  }
);

// Delete a remark
export const deleteRemark = createAsyncThunk(
  "remarks/deleteRemark",
  async (remarkId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/remarks/${remarkId}`);
      return remarkId; // Return the deleted remark's ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete the remark");
    }
  }
);

const initialState = {
  remarks: [],
  loading: false,
  error: null,
  success: false,
  message: null,
};

const remarkSlice = createSlice({
  name: "remarks",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch remarks by student ID
    builder
      .addCase(fetchRemarksByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemarksByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.remarks = action.payload.remarks;
      })
      .addCase(fetchRemarksByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create remark
    builder
      .addCase(createRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.remarks.push({
          remark_id: action.payload.remark_id,
          ...action.payload.remarkData, // Assuming you return the created remark's data
        });
      })
      .addCase(createRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update remark
    builder
      .addCase(updateRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        const index = state.remarks.findIndex(
          (remark) => remark.remark_id === action.payload.remarkId
        );
        if (index !== -1) {
          state.remarks[index] = {
            ...state.remarks[index],
            ...action.payload.remarkData,
          };
        }
      })
      .addCase(updateRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete remark
    builder
      .addCase(deleteRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.remarks = state.remarks.filter(
          (remark) => remark.remark_id !== action.payload
        );
      })
      .addCase(deleteRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = remarkSlice.actions;
export default remarkSlice.reducer;
