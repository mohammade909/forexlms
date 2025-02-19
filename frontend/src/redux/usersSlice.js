import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {BASEURL} from '../baseurl'

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async ({ user_type, token }, thunkAPI) => {
    let api;
    if (user_type) {
      api = `${BASEURL}/api/v1/users?user_type=${user_type}`;
    } else {
      api = `${BASEURL}/api/v1/users`;
    }
    try {
      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);
      
      return data;
    } catch (error) {
      console.log(error);
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const createUser = createAsyncThunk(
  "user/createUser",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to add student here
      const response = await fetch(`${BASEURL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Example asynchronous thunk to get students

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/users/${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Example asynchronous thunk to delete student
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`${BASEURL}/api/v1/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      console.log(data);
      return { userId: userId, message: data.message };
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Example asynchronous thunk to update student
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, updatedData }, thunkAPI) => {
    try {
      // Your asynchronous logic to update student here
      const response = await fetch(`${BASEURL}/api/v1/users/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
     console.log(data);
      return data;
    } catch (error) {
      // Handle error
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);



// Example asynchronous thunk to handle login

const initialState = {
  users: null,
  loading: false,
  error: null,
  message: null,
  user: null,
  absents: null,
};

const staffSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Define any synchronous actions here if needed
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload.users;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
  
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // .addCase(getEntries.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getEntries.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = null;
      //   state.absents = action.payload.absents;
      // })
      // .addCase(getEntries.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload.error;
      // })
      // .addCase(setAbsent.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(setAbsent.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = null;
      //   state.message = action.payload.message;
      // })
      // .addCase(setAbsent.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload.error;
      // })
      // .addCase(setPresent.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.message = null;
      // })
      // .addCase(setPresent.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.message = action.payload.message;
      // })
      // .addCase(setPresent.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload.error;
      // });
  },
});

export const { clearErrors, clearMessage } = staffSlice.actions;

export default staffSlice.reducer;
