import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API

// Fetch all students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async ({ class_id = null, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      // Build the query params based on whether class_id and/or section_id are provided
      const params = {};
      if (class_id) params.class_id = class_id;
      params.page = page;
      params.limit = limit;

      const response = await axios.get(`${BASEURL}/api/v1/students`, {
        params, // Pass the query params in the request
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const fetchStudentFees = createAsyncThunk(
  "students/fetchStudentFees",
  async (_, { rejectWithValue }) => {
    try {
      // Build the query params based on whether class_id and/or section_id are provided
      const response = await axios.get(`${BASEURL}/api/v1/students/fees`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Fetch a single student by ID
export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchStudentByUserId = createAsyncThunk(
  "students/fetchStudentByUserId",
  async (Id, { rejectWithValue }) => {
    console.log(Id);

    try {
      const response = await axios.get(`${BASEURL}/api/v1/students/user/${Id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Create a new student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      // No need to set headers explicitly here, axios will handle it for multipart/form-data
      const response = await axios.post(
        `${BASEURL}/api/v1/students`,
        studentData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Just to make sure it's set correctly, although axios handles this automatically
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update an existing student
export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ studentId, studentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/students/${studentId}`,
        studentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/students/${studentId}`);
      console.log(studentId);
      
      return studentId; // Return the deleted student's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  students: [],
  student: null,
  studentsFees: [], 
  loading: false,
  error: null,
  success: false,
  message: null,
  totalStudents: null,
  totalPages: null,
  currentPage: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.totalStudents = action.payload.totalStudents;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Fetch all students
    builder
      .addCase(fetchStudentFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        state.loading = false;
        state.studentsFees = action.payload.fees;
        
      })
      .addCase(fetchStudentFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch student by ID
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
      })
      .addCase(fetchStudentByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create student
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Teacher Created Successfully!"; // Add the new student
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Update student
    builder
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.students = state.students.map((student) =>
          student.teacher_id === action.payload.teacher_id
            ? action.payload
            : student
        );
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Delete student
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.students = state.students.filter(
          (student) => student.student_id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = studentSlice.actions;
export default studentSlice.reducer;
