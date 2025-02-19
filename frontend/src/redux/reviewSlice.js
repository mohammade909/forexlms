// Slice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {BASEURL} from '../baseurl' 
export const getReviews = createAsyncThunk(
  "review/get_reviews",
  async (course_id, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/reviews/${course_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const addReviews = createAsyncThunk(
  "review/add_reviews",
  async ({course_id, values}, thunkAPI) => {
    try {
      // Create a FormData object to hold the form values and file
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const response = await fetch(`${BASEURL}/api/v1/reviews/${course_id}`, {
        method: "POST",
        // Do not set Content-Type to application/json when using FormData
        body: formData,
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
// Example asynchronous thunk to get students

// export const getCommentById = createAsyncThunk(
//   "comment/getcommentById",
//   async (comment_id, thunkAPI) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/reviews/${comment_id}`);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       console.log(data);
//       return data;
//     } catch (error) {
//       console.log(error);
//       // Handle error
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );

// // Example asynchronous thunk to delete student
// export const deleteComment = createAsyncThunk(
//   "comment/deleteComment",
//   async ({comment_id}, thunkAPI) => {
    
//     try {
//       // Your asynchronous logic to delete student here
//       const response = await fetch(`http://localhost:8000/api/v1/reviews/${comment_id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }
//       const data = await response.json();
//       console.log(data);
//       return { comment_id: comment_id, message: data.message };
//     } catch (error) {
//       // Handle error
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );

// // Example asynchronous thunk to update student
// export const updateComment = createAsyncThunk(
//   "comment/updateComment",
//   async ({ comment_id, updatedData }, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       for (const key in updatedData) {
//         formData.append(key, updatedData[key]);
//       }
//       // Your asynchronous logic to update student here
//       const response = await fetch(`http://localhost:8000/api/v1/reviews/${comment_id}`, {
//         method: "PUT",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       console.log(data);
//       return data;
//     } catch (error) {
//       // Handle error
//       console.log(error);
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
  

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  message: null,
};

const Slice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message= null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Review added successfully";
      })
      .addCase(addReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
  },
});

export const { resetState } = Slice.actions;

export default Slice.reducer;
