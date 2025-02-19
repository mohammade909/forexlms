import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";
// Define the initial state for announcements
const initialState = {
  announcements: [],
  loading: false,
  error: null,
  message: null,
};

// Async thunks for the actions

// Fetch all announcements
export const getAnnouncements = createAsyncThunk(
  "announcements/getAnnouncements",
  async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/announcements`);
      return response.data.announcements; // This depends on your API response structure
    } catch (error) {
      throw Error(
        error.response.data.message || "Failed to fetch announcements"
      );
    }
  }
);

// Create a new announcement
export const createAnnouncement = createAsyncThunk(
  "announcements/createAnnouncement",
  async (announcementData) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/v1/announcements`,
        announcementData
      );
      return response.data; // Returns the created announcement data
    } catch (error) {
      throw Error(
        error.response.data.message || "Failed to create announcement"
      );
    }
  }
);

// Update an announcement by ID
export const updateAnnouncement = createAsyncThunk(
  "announcements/updateAnnouncement",
  async ({ id, announcementData }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/announcements/${id}`,
        announcementData
      );
      return response.data; // Returns the updated announcement data
    } catch (error) {
      throw Error(
        error.response.data.message || "Failed to update announcement"
      );
    }
  }
);

// Delete an announcement by ID
export const deleteAnnouncement = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async (id) => {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/v1/announcements/${id}`
      );
      return id; // Return the id of the deleted announcement
    } catch (error) {
      throw Error(
        error.response.data.message || "Failed to delete announcement"
      );
    }
  }
);

// Create the slice
const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(getAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Announcement has been created successfully";
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Announcement has been updated successfully";
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.filter(
          (announcement) => announcement.announcement_id !== action.payload
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState } = announcementSlice.actions;
// Export actions if needed, though there are none in this slice
export default announcementSlice.reducer;
