import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL as BASE_URL } from "../baseurl";

// Thunks for async operations

// Assignments Thunks
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (
    { page = 1, classId = "", startDate = "", endDate = "" },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      // Add query parameters if they exist
      if (classId) params.append("classId", classId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page);

      const response = await axios.get(`${BASE_URL}/api/v1/assignments`, {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching assignments."
      );
    }
  }
);

export const fetchAssignmentsByCourse = createAsyncThunk(
  "assignments/fetchAssignmentsByCourse",
  async (
    { page = 1, courseId, startDate = "", endDate = "" },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page);

      const response = await axios.get(
        `${BASE_URL}/api/v1/assignments/course/${courseId}`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching assignments."
      );
    }
  }
);

export const fetchAssignmentDetails = createAsyncThunk(
  "assignments/fetchAssignmentDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/assignments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching assignments."
      );
    }
  }
);

export const createAssignment = createAsyncThunk(
  "assignments/create",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/assignments`,
        assignmentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAssignment = createAsyncThunk(
  "assignments/update",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/assignments`,
        assignmentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (assignmentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/assignments/${assignmentId}`);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Submissions Thunks
export const fetchSubmissions = createAsyncThunk(
  "submissions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/submissions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAssignmentSubmissions = createAsyncThunk(
  "submissions/fetchAssignmentSubmissions",
  async ({ assignmentId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/assignments/${assignmentId}/student/${studentId}/submissions`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchSubmissionByAssignment = createAsyncThunk(
  "submissions/fetchSubmissionByAssignment",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/submissions/${assignmentId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createSubmission = createAsyncThunk(
  "submissions/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/submissions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSubmission = createAsyncThunk(
  "submissions/update",
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/submissions`,
        submissionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSubmission = createAsyncThunk(
  "submissions/delete",
  async (submissionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/submissions/${submissionId}`);
      return submissionId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState: {
    assignments: [],
    submissions: [],
    assignment: {},

    pagination: {},
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
    // Assignments
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchAssignmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.assignment = action.payload.assignment;
      })
      .addCase(fetchAssignmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Assignment created successfully";
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Assignment updated successfully";
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          (assignment) => assignment.assignment_id !== action.payload
        );
        state.message = "Assignment deleted successfully";
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Submissions
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubmissionByAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionByAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissionByAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssignmentSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions;
      })
      .addCase(fetchAssignmentSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Submission created successfully";
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Submission updated successfully";
      })
      .addCase(updateSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = state.submissions.filter(
          (submission) => submission.submission_id !== action.payload
        );
        state.message = "Submission deleted successfully";
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetState } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
