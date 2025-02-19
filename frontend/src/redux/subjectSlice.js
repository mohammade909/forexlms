import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API

// Fetch all subjects
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async ({ class_id, section_id } = {}, { rejectWithValue }) => {
    try {
      // Build query parameters conditionally
      let query = '';
      if (class_id) {
        query += `class_id=${class_id}`;
      }
      if (section_id) {
        query += (query ? '&' : '') + `section_id=${section_id}`;
      }

      // Construct the request URL with query parameters
      const url = `${BASEURL}/api/v1/subjects${query ? `?${query}` : ''}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Fetch a single student by ID
export const fetchSubjectsByClass = createAsyncThunk(
  "subjects/fetchSubjectsByClass",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/subjects/class/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSubjectsBySections = createAsyncThunk(
  "subjects/fetchSubjectsByClass",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/subjects/section/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchSubjectsByTeacher = createAsyncThunk(
  "subjects/fetchSubjectsByTeacher",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/subjects/teacher/${teacherId}`);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new student
export const createSubject = createAsyncThunk(
  "subjects/createSubject",
  async (subjectData, { rejectWithValue }) => {
    try {
      // No need to set headers explicitly here, axios will handle it for multipart/form-data
      const response = await axios.post(
        `${BASEURL}/api/v1/subjects`,
        subjectData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update an existing student
export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ subjectId, subjectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/subjects/${subjectId}`,
        subjectData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a student
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (subjectId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/subjects/${subjectId}`);
      return subjectId; // Return the deleted student's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  subjects: [],
  loading: false,
  error: null,
  success: false,
  message: null,

};

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all subjects
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects;
      
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch student by ID
    builder
      .addCase(fetchSubjectsByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects;
      })
      .addCase(fetchSubjectsByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error.message;
        state.subjects = []
      });
    builder
      .addCase(fetchSubjectsByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects;
      })
      .addCase(fetchSubjectsByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error.message;
        state.subjects = []
      });

    // Create student
    builder
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Teacher Created Successfully!"; // Add the new student
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Update student
    builder
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subjects = state.subjects.map((student) =>
          student.subject_id === action.payload.subject_id
            ? action.payload
            : student
        );
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Delete student
    builder
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subjects = state.subjects.filter(
          (student) => student.subject_id !== action.payload.id
        );
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = subjectSlice.actions;
export default subjectSlice.reducer;
