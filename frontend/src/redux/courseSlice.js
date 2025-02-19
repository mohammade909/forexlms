import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASEURL } from "../baseurl";

export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/courses`, {
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

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (values, thunkAPI) => {
    try {
      // Create a FormData object to hold the form values and file
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const response = await fetch(`${BASEURL}/api/v1/courses`, {
        method: "POST",
        // Do not set Content-Type to application/json when using FormData
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      // Handle error
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
// Example asynchronous thunk to get students

export const getcourseById = createAsyncThunk(
  "course/getCourseById",
  async (course_id, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/courses/${course_id}`);

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

export const getcourseByStudent = createAsyncThunk(
  "course/getcourseByStudent",
  async (studentId, thunkAPI) => {
    try {
      const response = await fetch(
        `${BASEURL}/api/v1/courses/student/${studentId}`
      );

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
export const getcourseByInstructor = createAsyncThunk(
  "course/getcourseByInstructor",
  async (instructor_id, thunkAPI) => {
    try {
      const response = await fetch(
        `${BASEURL}/api/v1/courses/instructor/${instructor_id}`
      );

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

// Example asynchronous thunk to delete student
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (course_id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`${BASEURL}/api/v1/courses/${course_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return course_id;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Example asynchronous thunk to update student
export const updatecourse = createAsyncThunk(
  "course/updateCourse",
  async ({ course_id, updatedData }, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
      // Your asynchronous logic to update student here
      const response = await fetch(`${BASEURL}/api/v1/courses/${course_id}`, {
        method: "PUT",
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

const initialState = {
  courses: [],
  course: null,
  loading: false,
  error: null,
  message: null,
  course: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getcourseByStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getcourseByStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.courses = action.payload;
      })
      .addCase(getcourseByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getcourseByInstructor.pending, (state) => {
        state.loading = true;
      })
      .addCase(getcourseByInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.courses = action.payload.courses;
      })
      .addCase(getcourseByInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getcourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getcourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.course = action.payload;
      })
      .addCase(getcourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updatecourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatecourse.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updatecourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.courses = state.courses.filter(
          (item) => item.course_id !== action.payload
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = courseSlice.actions;

export default courseSlice.reducer;
