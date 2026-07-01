import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { toast } from "react-toastify"

const API_URL = import.meta.env.VITE_API_URL

// Get all farmers
export const getAllFarmers = createAsyncThunk("farmers/getAllFarmers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/users/farmers`)
    return data
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message
    return rejectWithValue(message)
  }
})

// Get farmer profile
export const getFarmerProfile = createAsyncThunk("farmers/getFarmerProfile", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/users/farmers/${id}`)
    return data
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message
    return rejectWithValue(message)
  }
})

// Update farmer profile
export const updateFarmerProfile = createAsyncThunk(
  "farmers/updateFarmerProfile",
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await axios.put(`${API_URL}/users/farmers/profile`, profileData, config)
      return data
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message
      return rejectWithValue(message)
    }
  },
)

// Add review
export const addReview = createAsyncThunk(
  "farmers/addReview",
  async ({ farmerId, rating, comment }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/users/farmers/${farmerId}/reviews`,
        { rating, comment },
        config
      );
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Get farmer reviews
export const getFarmerReviews = createAsyncThunk(
  "farmers/getFarmerReviews",
  async (farmerId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/users/farmers/${farmerId}/reviews`
      );
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  farmers: [],
  farmerProfile: null,
  myFarmerProfile: null,
  reviews: [],
  loading: false,
  error: null,
  success: false,
};

const farmerSlice = createSlice({
  name: "farmers",
  initialState,
  reducers: {
    clearFarmerError: (state) => {
      state.error = null;
    },
    resetFarmerSuccess: (state) => {
      state.success = false;
    },
    clearFarmerProfile: (state) => {
      state.farmerProfile = null;
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all farmers
      .addCase(getAllFarmers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFarmers.fulfilled, (state, action) => {
        state.loading = false;
        state.farmers = action.payload.data || [];
      })
      .addCase(getAllFarmers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get farmer profile
      .addCase(getFarmerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerProfile = action.payload.data;
      })
      .addCase(getFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update farmer profile
      .addCase(updateFarmerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myFarmerProfile = action.payload.data;
        toast.success("Farmer profile updated successfully!");
      })
      .addCase(updateFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews.unshift(action.payload.review); // Add to top
        toast.success("Review added successfully!");
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get Reviews
      .addCase(getFarmerReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFarmerReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data || [];
      })
      .addCase(getFarmerReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearFarmerError,
  resetFarmerSuccess,
  clearFarmerProfile,
} = farmerSlice.actions;

export default farmerSlice.reducer;
