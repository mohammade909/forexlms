import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API

// Fetch all sections
export const fetchSections = createAsyncThunk(
  "sections/fetchSections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/sections`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single student by ID
export const fetchSectionByClass = createAsyncThunk(
  "sections/fetchSectionByClass",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/sections/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchSectionById = createAsyncThunk(
  "sections/fetchSectionById",
  async (Id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/sections/${Id}`);
    
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new student
export const createSection = createAsyncThunk(
  "sections/createSection",
  async (sectionData, { rejectWithValue }) => {
    try {
      // No need to set headers explicitly here, axios will handle it for multipart/form-data
      const response = await axios.post(
        `${BASEURL}/api/v1/sections`,
        sectionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update an existing student
export const updateSection = createAsyncThunk(
  "sections/updateSection",
  async ({ sectionId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/sections/${sectionId}`,
        sectionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a student
export const deleteSection = createAsyncThunk(
  "sections/deleteSection",
  async (sectionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/sections/${sectionId}`);
      return sectionId; // Return the deleted student's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  sections: [],
  student: null,
  section:null,
  loading: false,
  error: null,
  success: false,
  message: null,
  totalsections: null,
  totalPages: null,
  currentPage: null,
};

const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all sections
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.sections;
        state.totalsections = action.payload.totalsections;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch student by ID
    builder
      .addCase(fetchSectionByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.sections;
      })
      .addCase(fetchSectionByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error.message;
        state.sections = []
      })
      .addCase(fetchSectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.section = action.payload.section;
      })
      .addCase(fetchSectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error.message;
        state.section = []
      });

    // Create student
    builder
      .addCase(createSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Teacher Created Successfully!"; // Add the new student
      })
      .addCase(createSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Update student
    builder
      .addCase(updateSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
         state.message = action.payload.message;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Delete student
    builder
      .addCase(deleteSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.sections = state.sections.filter(
          (student) => student.student_id !== action.payload.id
        );
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = sectionSlice.actions;
export default sectionSlice.reducer;
