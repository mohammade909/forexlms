import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASEURL } from "../baseurl";

export const getOffers = createAsyncThunk(
  "offer/getOffers",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/offers`, {
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
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const createOffer = createAsyncThunk(
  "offer/createOffer",
  async (values, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const response = await fetch(`${BASEURL}/api/v1/offers`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const getOfferById = createAsyncThunk(
  "offer/getOfferById",
  async (offer_id, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/offers/${offer_id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "offer/deleteOffer",
  async (offer_id, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/offers/${offer_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return offer_id;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateOffer = createAsyncThunk(
  "offer/updateOffer",
  async ({ offer_id, updatedData }, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      const response = await fetch(`${BASEURL}/api/v1/offers/${offer_id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const initialState = {
  offers: [],
  loading: false,
  error: null,
  message: null,
  offer: null,
};

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offers = action.payload.offers;
      })
      .addCase(getOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getOfferById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offer = action.payload.offer;
      })
      .addCase(getOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Offer updated successfully";
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.offers = state.offers.filter((item) => item.offer_id !== action.payload);
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = offerSlice.actions;

export default offerSlice.reducer;
