import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl"; // Adjust the path based on your project structure

// Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/events`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/events/${eventId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/events`, eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update an existing event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/events/${eventId}`,
        eventData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete an event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/events/${eventId}`);
      return eventId; // Return the deleted event's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state for events
const initialState = {
  events: [],
  loading: false,
  error: null,
  success: false,
  message: null,
  totalEvents: null,
  totalPages: null,
  currentPage: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.totalEvents = action.payload.totalEvents;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch event by ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        const event = action.payload.event; // Assuming the API returns a single event
        state.events = state.events.map(e => e.event_id === event.event_id ? event : e); // Update the event if it exists
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error.message;
      });

    // Create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Event created successfully!";
        state.events.push(action.payload); // Add the new event
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Event Updated Successfully!";
        ;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Delete event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.events = state.events.filter(
          (event) => event.event_id !== action.payload // Assuming the response returns the ID of the deleted event
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = eventsSlice.actions;
export default eventsSlice.reducer;
