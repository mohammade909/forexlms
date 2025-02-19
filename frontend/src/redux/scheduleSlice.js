import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL as BASE_URL } from '../baseurl';
// Define the base URL for the API

// Async thunk to create a new schedule
export const createSchedule = createAsyncThunk(
  'schedules/create',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch all schedules
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/schedule`);
      return response.data.schedules; // Assuming your response contains a 'schedules' key
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchClassSchedules = createAsyncThunk(
  'schedules/fetchClassSchedules',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/schedule/class/${classId}`);
      return response.data; // Assuming your response contains a 'schedules' key
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchSchedulesByTeacher = createAsyncThunk(
  'schedules/fetchSchedulesByTeacher',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/schedule/teacher/${teacherId}`);
      console.log(response.data);
      
      return response.data; // Assuming your response contains a 'schedules' key
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch a schedule by ID
export const fetchScheduleById = createAsyncThunk(
  'schedules/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/schedule/${id}`);
      return response.data; // Assuming your response contains the schedule data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a schedule
export const updateSchedule = createAsyncThunk(
  'schedules/update',
  async ({ id, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/v1/schedule/${id}`, scheduleData);
      return response.data; // Assuming your response contains updated schedule data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a schedule
export const deleteSchedule = createAsyncThunk(
  'schedules/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/schedule/${id}`);
      return { id }; // Return the ID of the deleted schedule for the reducer
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const scheduleSlice = createSlice({
  name: 'schedules',
  initialState: {
    schedules: [],
    schedule: null,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    resetState:(state)=>{
        state.schedules = [];
        state.loading = false;
        state.error = null;
        state.message = null;
    }
  },
  extraReducers: (builder) => {
    // Create schedule
    builder.addCase(createSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message; // Assuming the payload contains the newly created schedule
    });
    builder.addCase(createSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });

    // Fetch all schedules
    builder.addCase(fetchSchedules.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.schedules = action.payload; // Replace schedules with fetched data
    });
    builder.addCase(fetchSchedules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Fetch all schedules
    builder.addCase(fetchClassSchedules.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClassSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.schedules = action.payload.schedules; // Replace schedules with fetched data
    });
    builder.addCase(fetchClassSchedules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchSchedulesByTeacher.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSchedulesByTeacher.fulfilled, (state, action) => {
      state.loading = false;
      state.schedule = action.payload.teacher; // Replace schedules with fetched data
    });
    builder.addCase(fetchSchedulesByTeacher.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch schedule by ID
    builder.addCase(fetchScheduleById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchScheduleById.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
      if (index >= 0) {
        state.schedules[index] = action.payload; // Update the specific schedule
      }
    });
    builder.addCase(fetchScheduleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update schedule
    builder.addCase(updateSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
      if (index >= 0) {
        state.schedules[index] = action.payload; // Update the specific schedule
      }
    });
    builder.addCase(updateSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete schedule
    builder.addCase(deleteSchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteSchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload.id); // Remove deleted schedule
    });
    builder.addCase(deleteSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {resetState} = scheduleSlice.actions
// Export the actions and reducer
export default scheduleSlice.reducer;
