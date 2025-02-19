import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";

// Async thunk for marking student as absent
export const markStudentAbsent = createAsyncThunk(
  "attendance/markStudentAbsent",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axios.post(
        `${BASEURL}/api/v1/attendance/students/absent`,
        data
      );
      return response.data; // Return the response data if successful
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error data if failed
    }
  }
);

// Async thunk for marking teacher as absent
export const markTeacherAbsent = createAsyncThunk(
  "attendance/markTeacherAbsent",
  async ({ teacher_id, attendance_date, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/attendance/teachers/absent`, {
        teacher_id,
        attendance_date,
        reason,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching student attendance by student ID
export const fetchStudentAttendance = createAsyncThunk(
  "attendance/fetchStudentAttendance",
  async (student_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/attendance/students/${student_id}`
      );
      return response.data; // Assuming the data is returned in this format
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchStudentAttendanceByUser = createAsyncThunk(
  "attendance/fetchStudentAttendanceByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/attendance/user/${userId}`
      );
      return response.data; // Assuming the data is returned in this format
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching teacher attendance by teacher ID
export const fetchTeacherAttendance = createAsyncThunk(
  "attendance/fetchTeacherAttendance",
  async (teacher_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/attendance/teachers/${teacher_id}`
      );
      return response.data.data; // Assuming the data is returned in this format
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching all student attendance records
export const fetchAllStudentAttendance = createAsyncThunk(
  "attendance/fetchAllStudentAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/attendance/students`);
      return response.data.data; // Assuming the data is returned in this format
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching all teacher attendance records
export const fetchAllTeacherAttendance = createAsyncThunk(
  "attendance/fetchAllTeacherAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/attendance/teachers`);
      return response.data.data; // Assuming the data is returned in this format
    } catch (error) {
      return rejectWithValue(error.response.data);
    } 
  }
);

// Create the attendance slice
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendances: [],
    loading: false,
    error: null,
    success:false
  },
  reducers: {
    clearAttendanceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markStudentAbsent.pending, (state) => {
        state.loading = true;
      })
      .addCase(markStudentAbsent.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true
      })
      .addCase(markStudentAbsent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markTeacherAbsent.pending, (state) => {
        state.loading = true;
      })
      .addCase(markTeacherAbsent.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(markTeacherAbsent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload.data; // Update state with fetched attendance
        state.error = null;
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentAttendanceByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentAttendanceByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload.attendances; // Update state with fetched attendance
        state.error = null;
      })
      .addCase(fetchStudentAttendanceByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTeacherAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload; // Update state with fetched attendance
        state.error = null;
      })
      .addCase(fetchTeacherAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllStudentAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload; // Update state with all student attendance
        state.error = null;
      })
      .addCase(fetchAllStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllTeacherAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTeacherAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload; // Update state with all teacher attendance
        state.error = null;
      })
      .addCase(fetchAllTeacherAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
